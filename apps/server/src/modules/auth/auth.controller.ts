import type {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  registerService,
  loginService,
} from "./auth.service.js";

export async function registerController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user =
      await registerService(req.body);

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
    const token =
      await loginService(req.body);

    return res.status(200).json({
      success: true,
      data: token,
    });
  } catch (error) {
    next(error);
  }
}