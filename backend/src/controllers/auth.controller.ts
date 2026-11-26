import type { NextFunction, Request, Response } from "express";
import {
  getUserById,
  loginUser,
  registerUser,
} from "../services/auth.service.js";
import { AppError } from "../errors/AppError.js";

export async function registerUserController(req: Request, res: Response) {
  const { email, password } = req.body;

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email.trim() ||
    !password
  ) {
    throw new AppError(400, "A valid email and password are required");
  }

  const normalisedEmail = email.trim().toLocaleLowerCase();

  const user = await registerUser(password, normalisedEmail);

  return res.status(201).json({
    success: true,
    data: user,
  });
}

export async function loginUserController(req: Request, res: Response) {
  const { email, password } = req.body;

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email.trim() ||
    !password
  ) {
    throw new AppError(400, "A valid email and password are required");
  }

  const normalisedEmail = email.trim().toLocaleLowerCase();

  const user = await loginUser(normalisedEmail, password);

  await new Promise<void>((resolve, reject) => {
    req.session.regenerate((error) => {
      if (error) reject(error);
      else resolve();
    });
  });

  req.session.userId = user.id;

  return res.status(200).json({
    success: true,
    data: user,
  });
}

export async function getCurrentUserController(req: Request, res: Response) {
  const userId = req.session.userId;

  if (!userId) {
    throw new AppError(401, "Not authenticated");
  }

  const user = await getUserById(userId);

  return res.status(200).json({
    success: true,
    data: user,
  });
}

export function logoutUserController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  req.session.destroy((error) => {
    if (error) {
      return next(error);
    }

    res.clearCookie("ticketflow.sid");

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  });
}
