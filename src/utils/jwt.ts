import jwt from "jsonwebtoken";
import { undefined } from "zod";

interface JwtPayload {
  account_id: string;
}
export const generateAccessToken = (payload: JwtPayload) => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET!,

    {
      expiresIn: "30m",
    }
  );
};
export const generateRefreshToken = (payload: JwtPayload) => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
};

export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  } catch {
    return null;
  }
};
