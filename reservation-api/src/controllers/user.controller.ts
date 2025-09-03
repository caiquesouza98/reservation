import { Request, Response, NextFunction } from "express";
import { matchedData } from "express-validator";
import userService from "../services/user.service";

class UserController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data = matchedData(req) as {
        name: string;
        email: string;
        password: string;
      };

      const user = await userService.register(data);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
