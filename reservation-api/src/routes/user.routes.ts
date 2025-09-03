import { Router, Request, Response, NextFunction } from "express";
import userController from "../controllers/user.controller";
import { registerUserValidator } from "../validators/user.validators";
import { validate } from "../middlewares/validate";

const router = Router();


/**
 * @swagger
 * /reservas:
 *   post:
 *     summary: Criar um usuário
 *     tags: [Reservas]
 *     responses:
 *       201:
 *         description: Criar um usuário
 */
router.post("/register", registerUserValidator, validate, (req: Request, res: Response, next: NextFunction) =>
  userController.register(req, res, next)
);

export default router;
