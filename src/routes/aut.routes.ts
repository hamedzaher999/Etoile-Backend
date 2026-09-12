import { Router } from "express";
import {
  register,
  login,
  send_otp,
  changePasswordByEmail,
  me,
  logout,
  verifyOtpController,
} from "../modules/auth/auth.controller.js";
import { validatorMiddleware } from "../middlewares/validator.middleware.js";
import {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  verifyOtpSchema,
} from "../modules/auth/auth.validation.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

import z from "zod";
const route = Router();
route.get("/me", authMiddleware(), me);
route.post("/logout", authMiddleware(), logout);
route.post("/login", validatorMiddleware(loginSchema, "body"), login);
route.post("/register", validatorMiddleware(registerSchema, "body"), register);
route.post(
  "/verify_otp",
  validatorMiddleware(verifyOtpSchema, "body"),
  verifyOtpController
);
route.post(
  "/resend_otp",
  validatorMiddleware(z.object({ email: z.email() }), "body"),
  send_otp
);
route.post(
  "/change_password",
  validatorMiddleware(changePasswordSchema, "body"),
  changePasswordByEmail
);

export default route;
