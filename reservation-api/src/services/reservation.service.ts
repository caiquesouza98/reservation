import reservationRepository from "../repositories/reservation.repository";
import { ReservationCreationAttributes, ReservationAttributes } from "../models/reservation.model";
import redisClient from "../config/redis";
import { AppError } from "../errors/AppError";

class ReservationService {
  async createReservation(data: ReservationCreationAttributes) {
    const conflict = await reservationRepository.findAll({ room: data.room });

    const hasConflict = conflict.rows.some(
      (r) =>
        new Date(data.startDate) < new Date(r.endDate) &&
        new Date(data.endDate) > new Date(r.startDate)
    );

    if (hasConflict) {
      throw new AppError("Conflito de horário: a sala já está reservada.", 409);
    }

    const newReservation = await reservationRepository.create(data);
    await redisClient.flushAll();

    return newReservation;
  }

  async listReservations(
    filters: Partial<ReservationAttributes>,
    options: { page?: number; limit?: number; sort?: string; order?: "asc" | "desc" }
  ) {
    return await reservationRepository.findAll(filters, options);
  }

  async cancelReservation(id: number) {
    const res = await reservationRepository.findById(id);
    if (!res) {
      throw new AppError("Reserva não encontrada.", 404);
    }
    const deleted = await reservationRepository.delete(id);
    await redisClient.flushAll();
    return deleted;
  }

  async updateReservation(id: number, data: Partial<ReservationCreationAttributes>) {
    const existing = await reservationRepository.findById(id);
    if (!existing) {
      throw new AppError("Reserva não encontrada.", 404);
    }

    if (data.startDate || data.endDate) {
      const newStart = data.startDate ?? existing.startDate;
      const newEnd = data.endDate ?? existing.endDate;

      if (newEnd <= newStart) {
        throw new AppError("endDate deve ser posterior ao startDate", 400);
      }

      const conflict = await reservationRepository.findAll({ room: existing.room });

      const hasConflict = conflict.rows.some(
        (r) =>
          r.id !== existing.id &&
          new Date(newStart) < new Date(r.endDate) &&
          new Date(newEnd) > new Date(r.startDate)
      );

      if (hasConflict) {
        throw new AppError("Conflito de horário: a sala já está reservada.", 409);
      }
    }

    const updated = await existing.update(data);
    await redisClient.flushAll();

    return updated;
  }
  
  async createRecurringReservations(data: {
    room: string;
    user: string;
    startDate: Date;
    endDate: Date;
    frequency: "daily" | "weekly";
    occurrences: number;
  }) {
    const createdReservations = [];

    let currentStart = new Date(data.startDate);
    let currentEnd = new Date(data.endDate);

    for (let i = 0; i < data.occurrences; i++) {
      const conflict = await reservationRepository.findAll({ room: data.room });
      const hasConflict = conflict.rows.some(
        (r) =>
          currentStart < new Date(r.endDate) &&
          currentEnd > new Date(r.startDate)
      );

      if (hasConflict) {
        throw new AppError(
          `Conflito detectado na ocorrência ${i + 1} (${currentStart.toISOString()})`,
          409
        );
      }

      const reservation = await reservationRepository.create({
        room: data.room,
        user: data.user,
        startDate: currentStart,
        endDate: currentEnd,
      });
      createdReservations.push(reservation);

      if (data.frequency === "daily") {
        currentStart.setDate(currentStart.getDate() + 1);
        currentEnd.setDate(currentEnd.getDate() + 1);
      } else if (data.frequency === "weekly") {
        currentStart.setDate(currentStart.getDate() + 7);
        currentEnd.setDate(currentEnd.getDate() + 7);
      }
    }

    await redisClient.flushAll();

    return createdReservations;
  }

}

export default new ReservationService();
