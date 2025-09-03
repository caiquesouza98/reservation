import { Request, Response, NextFunction } from "express";
import { matchedData } from "express-validator";
import authService from "../services/auth.service";

class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = matchedData(req) as { email: string; password: string };
      const result = await authService.login(email, password);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
