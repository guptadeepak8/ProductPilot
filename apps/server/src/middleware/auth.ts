import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { verifyToken } from "../utils/jwt.js";

import { AppError } from "../utils/AppError.js";

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    email: string;
  };
}

export function authenticate(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) {
  try {
    const token =
      req.cookies?.accessToken;

    if (!token) {
      throw new AppError(
        401,
        "Unauthorized"
      );
    }

    const payload =
      verifyToken(token);

    req.user = payload;

    next();
  } catch {
    next(
      new AppError(
        401,
        "Invalid or expired token"
      )
    );
  }
}

export function logoutController(
  _req: Request,
  res: Response
) {
  res.clearCookie("accessToken");

  return res.json({
    success: true,
    message: "Logged out successfully",
  });
}