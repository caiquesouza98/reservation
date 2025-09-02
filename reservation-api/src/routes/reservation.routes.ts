import { Router, Request, Response, NextFunction } from "express";
import reservationController from "../controllers/reservation.controller";
import { validate } from "../middlewares/validate";
import { cacheReservations } from "../middlewares/cache";
import {
  createReservationValidator,
  listReservationsValidator,
  cancelReservationValidator,
  updateReservationValidator,
  createRecurringReservationValidator,
} from "../validators/reservation.validators";

const router = Router();

/**
 * @swagger
 * /reservas:
 *   post:
 *     summary: Criar uma reserva
 *     tags: [Reservas]
 *     responses:
 *       201:
 *         description: Criar uma reserva
 */
router.post("/", createReservationValidator, validate, (req: Request, res: Response, next: NextFunction) =>
  reservationController.create(req, res, next)
);

/**
 * @swagger
 * /reservas:
 *   post:
 *     summary: Criar uma reserva com recorrência
 *     tags: [Reservas]
 *     responses:
 *       201:
 *         description: Criar uma reserva com recorrência
 */
router.post(
  "/recorrencia",
  createRecurringReservationValidator,
  validate,
  (req: Request, res: Response, next: NextFunction) => reservationController.createRecurring(req, res, next)
);

/**
 * @swagger
 * /reservas:
 *   get:
 *     summary: Lista reservas
 *     tags: [Reservas]
 *     responses:
 *       200:
 *         description: Lista de reservas
 */
router.get("/", listReservationsValidator, validate, cacheReservations,(req: Request, res: Response, next: NextFunction) =>
  reservationController.list(req, res, next)
);

/**
 * @swagger
 * /reservas:
 *   get:
 *     summary: Excluir uma reserva
 *     tags: [Reservas]
 *     responses:
 *       200:
 *         description: Excluir uma reserva
 */
router.delete("/:id", cancelReservationValidator, validate, (req: Request, res: Response, next: NextFunction) =>
  reservationController.cancel(req, res, next)
);

/**
 * @swagger
 * /reservas:
 *   get:
 *     summary: Alterar uma reserva
 *     tags: [Reservas]
 *     responses:
 *       200:
 *         description: Alterar uma reserva
 */
router.patch("/:id", updateReservationValidator, validate, (req: Request, res: Response, next: NextFunction) =>
  reservationController.update(req, res, next)
);

export default router;
