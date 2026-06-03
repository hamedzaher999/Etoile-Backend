import { Request, Response } from "express";
import {
  changeForgottenPassword,
  loginUser,
  logoutUser,
  registerUser,
  resendEmailOtp,
  verifyEmail,
} from "./auth.service.js";
import { errorhandler } from "../../utils/errorMessage.js";

export const register = async (req: Request, res: Response) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({
      success: true,
      data: user,
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
    await resendEmailOtp(email);
    res.status(201).send({
      success: true,
      message: "OTP was send to your email",
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
    const { accessToken, refreshToken, user } = result;
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 20,
    });
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 5,
    });
    res.status(200).send({
      success: true,
      data: user,
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

export const verifyEmailController = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const result = await verifyEmail(email, otp);
    res.cookie("access_token", result.accessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 15,
    });
    res.cookie("access_token", result.refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
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
    data: req.user,
  });
};
//============================================
export const logout = async (req: Request, res: Response) => {
  try {
    await logoutUser(
      req.user!.id,
      req.cookies.refresh_token,
      req.body.allSessions
    );
    res.clearCookie("access_token", {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.clearCookie("refresh_token", {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).send({
      success: true,
      message: "logged out successfully",
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

//============================================

//============================================
