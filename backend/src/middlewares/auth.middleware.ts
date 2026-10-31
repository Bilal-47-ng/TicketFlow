import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.js";

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const userId = req.session.userId;
  if (!userId) {
    throw new AppError(401, "Not authenticated");
  }

  next();
}
