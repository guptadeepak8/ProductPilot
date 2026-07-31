import jwt from "jsonwebtoken";
import { env } from "../config/env.js";



export interface JwtPayload {
  userId: number;
  email: string;
}

export function generateToken(
  payload: JwtPayload
) {
  return jwt.sign(
    payload,
    env.JWT_SECRET,
    {
      expiresIn: "1D",
    }
  );
}

export function verifyToken(
  token: string
) {
  return jwt.verify(
    token,
    env.JWT_SECRET
  ) as JwtPayload;
}