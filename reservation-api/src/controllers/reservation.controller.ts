import { Request, Response, NextFunction } from "express";
import reservationService from "../services/reservation.service";

class ReservationController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const reservation = await reservationService.createReservation(req.body);
      res.status(201).json(reservation);
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const filters: any = {};
      if (req.query.room) filters.room = req.query.room;
      if (req.query.user) filters.user = req.query.user;

      const reservations = await reservationService.listReservations(filters);
      res.json(reservations);
    } catch (error) {
      next(error);
    }
  }

  async cancel(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      await reservationService.cancelReservation(id);
      res.json({ message: "Reserva cancelada com sucesso." });
    } catch (error) {
      next(error);
    }
  }
}

export default new ReservationController();
