import reservationRepository from "../repositories/reservation.repository";
import { ReservationCreationAttributes, ReservationAttributes } from "../models/reservation.model";

class ReservationService {
  async createReservation(data: ReservationCreationAttributes) {
    const conflict = await reservationRepository.findAll({ room: data.room });

    const hasConflict = conflict.some(
      (r) =>
        new Date(data.startDate) < new Date(r.endDate) &&
        new Date(data.endDate) > new Date(r.startDate)
    );

    if (hasConflict) {
      throw new Error("Conflito de horário: a sala já está reservada.");
    }

    return await reservationRepository.create(data);
  }

  async listReservations(filters: Partial<ReservationAttributes>) {
    return await reservationRepository.findAll(filters);
  }

  async cancelReservation(id: number) {
    const res = await reservationRepository.findById(id);
    if (!res) throw new Error("Reserva não encontrada.");
    return await reservationRepository.delete(id);
  }
}

export default new ReservationService();
