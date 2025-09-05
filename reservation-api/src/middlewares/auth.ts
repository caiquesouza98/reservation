import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError";

export interface AuthRequest extends Request {
  user?: { sub: number; role: string };
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.token;
  if (!token) throw new AppError("Não autenticado", 401);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as unknown as {
      sub: number;
      role: string;
    };
    req.user = decoded;
    next();
  } catch {
    throw new AppError("Token inválido ou expirado", 401);
  }
}
