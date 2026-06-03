import bcrypt from "bcrypt";
import {
  selectUserByEmail,
  updateUserPassword,
  selectLatestOtpByAccountId,
  updateOtpAsUsed,
  updateVerifyUserEmail,
  selectUserById,
  insertUser,
  insertRefreshToken,
  updateRevokeAllRefreshToken,
  selectRefreshTokenByHash,
  updateRevokeRefreshTokenByHash,
  updateRevokeRefreshTokenById as revokeRefreshTokenById,
} from "./auth.model.js";
import { generateOtp } from "../../utils/generateOtp.js";
import {
  updateInvalidateOldOtp,
  insertEmailVerificationOtp,
} from "./auth.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../../utils/jwt.js";
import { Resend } from "resend";
import { hashToken } from "../../utils/hash_token.js";
import { sanitizeUser } from "../../utils/sanitizeUser.js";
import { CustomError } from "../../utils/customError.js";
import { User } from "./auth.type.js";
import { email } from "zod";
interface RegisterUserParams {
  name: string;
  username: string;
  email: string;
  password: string;
}

export const registerUser = async ({
  name,
  email,
  username,
  password,
}: RegisterUserParams) => {
  const existingUser = await selectUserByEmail(email);

  if (existingUser && existingUser.email_verified_at) {
    throw new CustomError(400, "Email already exist");
  }
  const password_hash = await bcrypt.hash(password, 10);

  if (existingUser && !existingUser.email_verified_at) {
    await updateUserPassword(existingUser.id, password_hash);
    await sendVerificationOtp(existingUser);
    return sanitizeUser(existingUser);
  }
  const account = await insertUser({ name, email, username, password_hash });
  if (!account) throw new CustomError(500, "register failed,please try again");
  await sendVerificationOtp(account);
  return sanitizeUser(account);
};

//============================================

export const resendEmailOtp = async (email: string) => {
  const user = await selectUserByEmail(email);
  if (!user) {
    throw new CustomError(400, "account not found.");
  }
  await sendVerificationOtp(user);
};

//============================================
export const refreshUserToken = async (
  refreshToken: string,
  meta: { ip_address?: string; device_name?: string; user_agent?: string }
) => {
  const payload = verifyToken(refreshToken);
  if (!payload) throw new CustomError(401, "unauthorized");

  const token_hash = hashToken(refreshToken);
  const storedRefreshToken = await selectRefreshTokenByHash(token_hash);
  if (!storedRefreshToken || storedRefreshToken.is_revoked) {
    throw new CustomError(401, "invalid refresh token.");
  }
  const user = await selectUserById(payload.account_id);
  if (!user) {
    throw new CustomError(400, "user not found.");
  }
  const newAccessToken = generateAccessToken({
    account_id: payload.account_id,
  });
  const newRefreshToken = generateRefreshToken({
    account_id: payload.account_id,
  });
  const newRefreshToken_hash = hashToken(newRefreshToken);
  const expires_at = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
  await insertRefreshToken(
    payload.account_id,
    storedRefreshToken.id,
    newRefreshToken_hash,
    expires_at,
    meta.ip_address,
    meta.device_name,
    meta.user_agent
  );
  await revokeRefreshTokenById(storedRefreshToken.id);
  return {
    user: sanitizeUser(user),
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};
//============================================

export const loginUser = async (
  email: string,
  password: string,
  meta?: {
    ip_address?: string;
    device_name?: string;
    user_agent?: string;
  }
) => {
  const account = await selectUserByEmail(email);
  if (!account || (account && !account.email_verified_at))
    throw new CustomError(400, "Account not found.");
  const isValidPassword = await bcrypt.compare(password, account.password_hash);
  if (!isValidPassword) {
    throw new CustomError(400, "login failed, please check your credential.");
  }
  const accessToken = generateAccessToken({
    account_id: account.id,
  });
  const refreshToken = generateRefreshToken({
    account_id: account.id,
  });
  const refreshToken_hash = hashToken(refreshToken);
  const refreshToken_expiry_date = new Date(
    Date.now() + 1000 * 60 * 60 * 24 * 7
  );
  await insertRefreshToken(
    account.id,
    null,
    refreshToken_hash,
    refreshToken_expiry_date,
    meta?.ip_address,
    meta?.device_name,
    meta?.user_agent
  );
  return {
    user: sanitizeUser(account),
    accessToken,
    refreshToken,
  };
};

//============================================

export const sendVerificationOtp = async (user: User) => {
  await updateInvalidateOldOtp(user.id);
  const otp = generateOtp();
  const otp_hash = await bcrypt.hash(otp, 10);
  const expires_at = new Date(Date.now() + 1000 * 60 * 10);
  await insertEmailVerificationOtp(user.id, otp_hash, expires_at);
  const resend = new Resend(process.env.EMAIL_KEY);
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: user.email,
    subject: "verify your account",
    html: `
      <h1>Email Verification</h1>

      <p>Your OTP code is:</p>

      <h2>${otp}</h2>

      <p>This code expires in 10 minutes.</p>
    `,
  });
};

//============================================

export const verifyEmail = async (email: string, otp: string) => {
  const user = await selectUserByEmail(email);
  if (!user) throw new CustomError(400, "account not found.");
  if (user.email_verified_at)
    throw new CustomError(400, "Email already verified.");
  const sendedOtp = await selectLatestOtpByAccountId(user.id);
  if (!sendedOtp) throw new CustomError(400, "otp not found.");

  const now = new Date();
  if (now > sendedOtp.expires_at) throw new CustomError(400, "Invalid otp.");
  const isValidOtp = await bcrypt.compare(otp, sendedOtp.otp_hash);
  if (!isValidOtp) throw new CustomError(400, "Invalid otp.");

  await updateOtpAsUsed(sendedOtp.id);
  const verifiedUser = await updateVerifyUserEmail(user.id);
  const accessToken = generateAccessToken({
    account_id: verifiedUser.id,
  });
  const refreshToken = generateRefreshToken({
    account_id: user.id,
  });
  const refreshToken_hash = hashToken(refreshToken);
  const refreshToken_expiry_date = new Date(
    Date.now() + 1000 * 60 * 60 * 24 * 7
  );
  await insertRefreshToken(
    verifiedUser.id,
    null,
    refreshToken_hash,
    refreshToken_expiry_date
  );
  return {
    user: sanitizeUser(verifiedUser),
    accessToken,
    refreshToken,
  };
};

//============================================

export const changeForgottenPassword = async (
  email: string,
  otp: string,
  new_password: string
) => {
  const user = await selectUserByEmail(email);
  if (!user)
    throw new CustomError(400, "please check your email and try again.");

  const sendedOtp = await selectLatestOtpByAccountId(user.id);
  const isValidOtp = await bcrypt.compare(otp, sendedOtp.otp_hash);
  if (!isValidOtp) throw new CustomError(400, "invalid otp.");

  const new_password_hash = await bcrypt.hash(new_password, 10);
  await updateInvalidateOldOtp(user.id);
  await updateUserPassword(user.id, new_password_hash);
  await updateRevokeAllRefreshToken(user.id);
};

//============================================
export const changePassword = async (
  email: string,
  oldPassword: string,
  new_password: string
) => {
  const user = await selectUserByEmail(email);
  if (!user)
    throw new CustomError(400, "please check your email and try again.");
  const isValidPassword = await bcrypt.compare(oldPassword, user.password_hash);
  if (!isValidPassword) throw new CustomError(400, "wrong password.");
  const new_password_hash = await bcrypt.hash(new_password, 10);
  await updateUserPassword(user.id, new_password_hash);
  await updateRevokeAllRefreshToken(user.id);
};
//============================================
export const logoutUser = async (
  account_id: string,
  refreshToken: string,
  allSessions: boolean = false
) => {
  if (allSessions) {
    await updateRevokeAllRefreshToken(account_id);
    return;
  }
  const valid = verifyToken(refreshToken);
  if (!valid) return;
  const refreshToken_hash = hashToken(refreshToken);
  await updateRevokeRefreshTokenByHash(refreshToken_hash);
};
//============================================
