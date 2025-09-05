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
import { authenticate } from "../middlewares/auth";

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
router.post("/", authenticate, createReservationValidator, validate, (req: Request, res: Response, next: NextFunction) =>
  reservationController.create(req, res, next)
);

/**
 * @swagger
 * /reservas/recorrencia:
 *   post:
 *     summary: Criar uma reserva com recorrência
 *     tags: [Reservas]
 *     responses:
 *       201:
 *         description: Criar uma reserva com recorrência
 */
router.post(
  "/recorrencia",
  authenticate,
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
router.get("/", authenticate, listReservationsValidator, validate, cacheReservations,(req: Request, res: Response, next: NextFunction) =>
  reservationController.list(req, res, next)
);

/**
 * @swagger
 * /reservas/:id :
 *   delete:
 *     summary: Excluir uma reserva
 *     tags: [Reservas]
 *     responses:
 *       200:
 *         description: Excluir uma reserva
 */
router.delete("/:id", authenticate, cancelReservationValidator, validate, (req: Request, res: Response, next: NextFunction) =>
  reservationController.cancel(req, res, next)
);

/**
 * @swagger
 * /reservas/:id :
 *   patch:
 *     summary: Alterar uma reserva
 *     tags: [Reservas]
 *     responses:
 *       200:
 *         description: Alterar uma reserva
 */
router.patch("/:id", authenticate, updateReservationValidator, validate, (req: Request, res: Response, next: NextFunction) =>
  reservationController.update(req, res, next)
);

export default router;
