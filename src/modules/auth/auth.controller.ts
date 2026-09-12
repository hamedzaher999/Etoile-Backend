import { Request, Response } from "express";
import {
  changeForgottenPassword,
  loginUser,
  registerUser,
  resendOtp,
  verifyOtp,
} from "./auth.service.js";
import { errorhandler } from "../../utils/errorMessage.js";
export const register = async (req: Request, res: Response) => {
  try {
    const result = await registerUser(req.body);
    res.status(201).json({
      success: true,
      data: result.user,
      otp: result.otp, // TODO: remove once real email/sms sending is wired up
    });
  } catch (e) {
    const error = errorhandler(e);
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

//============================================

export const send_otp = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const otp = await resendOtp(email);
    res.status(201).send({
      success: true,
      message: "OTP generated",
      otp, // TODO: remove once real email/sms sending is wired up
    });
  } catch (e) {
    const error = errorhandler(e);
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

//============================================

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);
    res.cookie("access_token", result.accessToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    res.status(200).send({
      success: true,
      data: result.user,
    });
  } catch (e) {
    const error = errorhandler(e);
    res.status(error.statusCode).send({
      success: false,
      message: error.message,
    });
  }
};

//============================================

export const verifyOtpController = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const result = await verifyOtp(email, otp);
    res.cookie("access_token", result.accessToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    res.status(201).send({
      success: true,
      data: result.user,
    });
  } catch (e) {
    const error = errorhandler(e);
    res.status(error.statusCode).send({
      success: false,
      message: error.message,
    });
  }
};

//============================================

export const changePasswordByEmail = async (req: Request, res: Response) => {
  const { email, otp, new_password } = req.body;
  try {
    await changeForgottenPassword(email, otp, new_password);
    res.status(201).send({
      success: true,
      message: "password has been changed successfully, login to continue",
    });
  } catch (e) {
    const error = errorhandler(e);
    res.status(error.statusCode).send({
      success: false,
      message: error.message,
    });
  }
};

//============================================
export const me = async (req: Request, res: Response) => {
  res.status(200).send({
    success: true,
    data: req.user || req.admin,
  });
};
//============================================
export const logout = async (_req: Request, res: Response) => {
  res.clearCookie("access_token", {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.status(200).send({
    success: true,
    message: "logged out successfully",
  });
};
//============================================
