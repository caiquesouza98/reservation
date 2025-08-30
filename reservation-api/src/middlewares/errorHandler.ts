import { Request, Response, NextFunction } from "express";

function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error(err.message);
  res.status(400).json({ error: err.message });
}

export default errorHandler;
