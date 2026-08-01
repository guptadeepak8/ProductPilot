import type {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  registerService,
  loginService,
  meService,
} from "./auth.service.js";
import type { AuthRequest } from "../../middleware/auth.js";

export async function registerController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { token, user } = await registerService(req.body);

res.cookie("accessToken", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "none",
  maxAge: 24 * 60 * 60 * 1000,
});

return res.status(201).json({
  success: true,
  message: "User registered successfully",
  data: user,
});
  } catch (error) {
    next(error);
  }
}

export async function loginController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
   const { token, user } = await loginService(req.body);

res.cookie("accessToken", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "none",
  maxAge: 24 * 60 * 60 * 1000,
});

return res.status(200).json({
  success: true,
  message: "Login successful",
  data: user,
});
  } catch (error) {
    next(error);
  }
}

export async function meController(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const user =
      await meService(
        req.user!.userId
      );

    return res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}