import { Request, Response, NextFunction } from "express";
import authService from "../services/auth.service";

class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const { token, user } = await authService.login(email, password);

      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24,
        path: "/",
      });
      res.json({ user });
    } catch (err) {
      next(err);
    }
  }

  async logout(req: Request, res: Response) {
    res.clearCookie("token");
    res.json({ message: "Logout efetuado" });
  }
}

export default new AuthController();
