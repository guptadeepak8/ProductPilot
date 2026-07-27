import { Router } from "express";

import {
  registerController,
  loginController,
} from "./auth.controller.js";

import { validate } from "../../middleware/validate.js";

import {
  registerSchema,
  loginSchema,
} from "./auth.schema.js";

const router = Router();

router.post(
  "/register",
  validate(registerSchema),
  registerController
);

router.post(
  "/login",
  validate(loginSchema),
  loginController
);

export default router;