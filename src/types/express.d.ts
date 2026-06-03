import { SanitizedUser, User } from "../modules/auth/auth.type.ts";
declare global {
  namespace Express {
    interface Request {
      user?: SanitizedUser;
      admin?: Admin;
    }
  }
}
