import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt.js";
import { selectUserById } from "../modules/auth/auth.model.js";
import { refreshUserToken } from "../modules/auth/auth.service.js";
import { sanitizeUser } from "../utils/sanitizeUser.js";
import { Role } from "../types/app.types.js";

export const authMiddleware = (role: Role) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.access_token;
      const payload = verifyToken(token);

      if (payload) {
        const account = await selectUserById(payload.account_id);

        if (!account) {
          return res.status(400).json({
            success: false,
            message: "User not found",
          });
        }

        if (account.status !== "active" || account.type !== role) {
          return res.status(401).json({
            success: false,
            message: "unauthorized.",
          });
        }

        if (role === "admin") {
          req.admin = sanitizeUser(account);
        } else {
          req.user = sanitizeUser(account);
        }

        next();
      } else {
        const refreshToken = req.cookies.refresh_token;
        console.log(refreshToken);
        const result = await refreshUserToken(refreshToken, {});
        req.user = result.user;
        res.cookie("access_token", result.accessToken, {
          httpOnly: true,
          sameSite: "strict",
          secure: process.env.NODE_ENV === "production",
          maxAge: 1000 * 60 * 15 * 30,
        });
        res.cookie("refresh_token", result.refreshToken, {
          httpOnly: true,
          sameSite: "strict",
          secure: process.env.NODE_ENV === "production",
          maxAge: 1000 * 60 * 60 * 24 * 7,
        });
        return next();
      }
    } catch (error) {
      return res.status(401).send({
        success: false,
        message: "unauthorized",
      });
    }
  };
};
