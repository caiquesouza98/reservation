import { Router, Request, Response, NextFunction } from "express";
import { loginValidator } from "../validators/auth.validators";
import { validate } from "../middlewares/validate";
import authController from "../controllers/auth.controller";

const router = Router();

router.post("/login", loginValidator, validate, (req: Request, res: Response, next: NextFunction) =>
  authController.login(req, res, next)
);

export default router;
