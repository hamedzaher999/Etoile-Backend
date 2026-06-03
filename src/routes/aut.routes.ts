import { Router } from "express";
import {
  register,
  login,
  verifyEmailController,
  send_otp,
  changePasswordByEmail,
  me,
  logout,
} from "../modules/auth/auth.controller.js";
import { validatorMiddleware } from "../middlewares/validator.middleware.js";
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  changePasswordSchema,
} from "../modules/auth/auth.validation.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const route = Router();
route.get("/me", authMiddleware(), me);
route.post("/logout", authMiddleware(), logout);
route.post("/login", validatorMiddleware(loginSchema, "body"), login);
route.post("/register", validatorMiddleware(registerSchema, "body"), register);
route.post(
  "/verify_email",
  validatorMiddleware(verifyEmailSchema, "body"),
  verifyEmailController
);
route.post("/resend_otp", send_otp);
route.post(
  "/change_password",
  validatorMiddleware(changePasswordSchema, "body"),
  changePasswordByEmail
);

export default route;
