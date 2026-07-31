import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { AppError } from "../../utils/AppError.js";

import * as authRepository from "./auth.repository.js";

import type {
  RegisterInput,
  LoginInput,
} from "./auth.schema.js";
import { generateToken } from "../../utils/jwt.js";

export async function registerService(
  data: RegisterInput
) {
  const existingUser =
    await authRepository.findUserByEmail(data.email);

  if (existingUser) {
    throw new AppError(
      409,
      "Email already exists"
    );
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await authRepository.createUser(
      data.email,
      hashedPassword
    );

   const token = generateToken({
    userId: user.id,
    email: user.email,
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
    },
  };
}

export async function loginService(
  data: LoginInput
) {
  const user =
    await authRepository.findUserByEmail(data.email);

  if (!user) {
    throw new AppError(
      401,
      "Invalid email or password"
    );
  }

  const isValid =
    await bcrypt.compare(
      data.password,
      user.password
    );

  if (!isValid) {
    throw new AppError(
      401,
      "Invalid email or password"
    );
  }

const token = generateToken({
  userId: user.id,
  email: user.email,
});

  return {
    token,
    user: {
    id: user.id,
    email: user.email,
  },
  };
}

export async function meService(
  userId: number
) {
  const user =
    await authRepository.findUserById(
      userId
    );

  if (!user) {
    throw new AppError(
      404,
      "User not found"
    );
  }

  return {
    id: user.id,
    email: user.email,
  };
}