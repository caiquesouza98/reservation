import { Request, Response, NextFunction } from "express";
import { matchedData } from "express-validator";
import reservationService from "../services/reservation.service";
import {
  ReservationCreationAttributes,
  ReservationAttributes,
} from "../models/reservation.model";

class ReservationController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = matchedData(req, { locations: ["body"] }) as Pick<
        ReservationCreationAttributes,
        "room" | "user" | "startDate" | "endDate"
      >;

      const reservation = await reservationService.createReservation(data);
      res.status(201).json(reservation);
    } catch (error) {
      next(error);
    }
  }

  async createRecurring(req: Request, res: Response, next: NextFunction) {
    try {
      const data = matchedData(req, { locations: ["body"] }) as {
        room: string;
        user: string;
        startDate: string;
        endDate: string;
        frequency: "daily" | "weekly";
        occurrences: number;
      };

      const reservations = await reservationService.createRecurringReservations(data);
      res.status(201).json(reservations);
    } catch (error) {
      next(error);
    }
  }


  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = matchedData(req, { locations: ["query"] }) as {
        room?: string;
        user?: string;
        page?: number;
        limit?: number;
        sort?: string;
        order?: "asc" | "desc";
      };

      const { room, user, page, limit, sort, order } = filters;

      const result = await reservationService.listReservations(
        { room, user },
        { page, limit, sort, order }
      );

      res.json({
        total: result.count,
        page: page || 1,
        limit: limit || 10,
        data: result.rows,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, ...updates } = matchedData(req, { locations: ["params", "body"] }) as {
        id: number;
        startDate?: string;
        endDate?: string;
      };

      const reservation = await reservationService.updateReservation(id, updates);
      res.json(reservation);
    } catch (error) {
      next(error);
    }
  }

  async cancel(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = matchedData(req, { locations: ["params"] }) as { id: number };
      await reservationService.cancelReservation(id);
      res.json({ message: "Reserva cancelada com sucesso." });
    } catch (error) {
      next(error);
    }
  }
}

export default new ReservationController();
