import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../errors/AppError';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

export interface AuthRequest extends Request {
  user?: { sub: number; role: string };
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) throw new AppError("Token não fornecido", 401);

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET || "secret") as unknown as {
      sub: number;
      role: string;
    };
    req.user = decoded;
    next();
  } catch (err) {
    throw new AppError("Token inválido ou expirado", 401);
  }
}

export function generateToken(payload: string | object | Buffer) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}