import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import logger from "../config/logger";

function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof AppError) {
    logger.warn(`Handled error in ${req.method} ${req.url}: ${err.message}`);
    return res.status(err.statusCode).json({
      error: err.message,
      details: err.details || null,
    });
  }

  logger.error(`Unexpected error in ${req.method} ${req.url}: ${err.message}`, { stack: err.stack });
  return res.status(500).json({
    error: "Internal Server Error",
  });
}

export default errorHandler;
