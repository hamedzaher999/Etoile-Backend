import { Request, Response, NextFunction } from "express";
import z, { ZodObject } from "zod";
import { UNKNOWN_ERROR } from "../constant/errors.js";
export const validatorMiddleware = (
  schema: ZodObject,
  scope: "body" | "params"
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[scope]);
    if (!result.success) {
      let message = "";
      const flatten = z.flattenError(result.error);
      const keys = Object.keys(flatten.fieldErrors);

      if (keys.length === 0) {
        message = UNKNOWN_ERROR;
      } else {
        message = flatten.fieldErrors[keys[0]]?.[0] || UNKNOWN_ERROR;
      }

      return res.status(400).json({
        success: false,
        message,
      });
    }
    req.body = result.data;
    next();
  };
};
