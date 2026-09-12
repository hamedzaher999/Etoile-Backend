import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt.js";
import { selectUserById } from "../modules/auth/auth.model.js";
import { sanitizeUser } from "../utils/sanitizeUser.js";
import { Role } from "../types/app.types.js";

export const authMiddleware = (role?: Role) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.access_token;
      if (!token) {
        return res.status(401).json({
          success: false,
          message: "unauthorized",
        });
      }
      const payload = verifyToken(token);
      if (!payload) {
        return res.status(401).json({
          success: false,
          message: "unauthorized",
        });
      }
      const account = await selectUserById(payload.account_id);

      if (!account) {
        return res.status(400).json({
          success: false,
          message: "User not found",
        });
      }

      if (account.status !== "active" || (role && account.type !== role)) {
        return res.status(401).json({
          success: false,
          message: "unauthorized.",
        });
      }

      if (account.type === "admin") {
        req.admin = sanitizeUser(account);
      } else {
        req.user = sanitizeUser(account);
      }

      next();
    } catch (error) {
      return res.status(401).send({
        success: false,
        message: "unauthorized",
      });
    }
  };
};
