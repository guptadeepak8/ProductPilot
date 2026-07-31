import { Router } from "express";

import {
  registerController,
  loginController,
  meController,
} from "./auth.controller.js";

import { validate } from "../../middleware/validate.js";

import {
  registerSchema,
  loginSchema,
} from "./auth.schema.js";
import { authenticate, logoutController } from "../../middleware/auth.js";

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

router.post(
  "/logout",
  authenticate,
  logoutController
);

router.get(
  "/me",
  authenticate,
  meController
);

export default router;