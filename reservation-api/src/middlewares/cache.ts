import { Request, Response, NextFunction } from "express";
import redisClient from "../config/redis";

export async function cacheReservations(req: Request, res: Response, next: NextFunction) {
  try {
    const key = `reservas:${JSON.stringify(req.query)}`;
    const cached = await redisClient.get(key);

    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const originalJson = res.json.bind(res);
    res.json = (body: any) => {
      redisClient.setEx(key, 60, JSON.stringify(body));
      return originalJson(body);
    };

    next();
  } catch (error) {
    next(error);
  }
}
