import { Router, Request, Response, NextFunction } from "express";
import { loginValidator } from "../validators/auth.validators";
import { validate } from "../middlewares/validate";
import authController from "../controllers/auth.controller";

const router = Router();

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Fazer login
 *     tags: [Auth]
 *     responses:
 *       201:
 *         description: Criar uma reserva
 */
router.post("/login", loginValidator, validate, (req: Request, res: Response, next: NextFunction) =>
  authController.login(req, res, next)
);

router.get("/check", (req: Request, res: Response) => {
  if (req.cookies?.token) {
    return res.json({ authenticated: true });
  }
});

export default router;
