import bcrypt from "bcrypt";
import {
  selectUserByEmail,
  updateUserPassword,
  selectLatestOtpByAccountId,
  updateOtpAsUsed,
  updateVerifyUserEmail,
  insertUser,
  insertOtp,
} from "./auth.model.js";
import { generateOtp } from "../../utils/generateOtp.js";
import { updateInvalidateOldOtp } from "./auth.model.js";
import { generateAccessToken, verifyToken } from "../../utils/jwt.js";
import { sanitizeUser } from "../../utils/sanitizeUser.js";
import { CustomError } from "../../utils/customError.js";
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
    const otp = await createVerificationOtp(existingUser.id);
    return { user: sanitizeUser(existingUser), otp };
  }
  const account = await insertUser({ name, email, username, password_hash });
  if (!account) throw new CustomError(500, "register failed,please try again");
  const otp = await createVerificationOtp(account.id);
  return { user: sanitizeUser(account), otp };
};

//============================================

export const resendOtp = async (email: string) => {
  const user = await selectUserByEmail(email);
  if (!user) {
    throw new CustomError(400, "account not found.");
  }
  const otp = await createVerificationOtp(user.id);
  return otp;
};

//============================================

export const loginUser = async (email: string, password: string) => {
  const account = await selectUserByEmail(email);
  if (!account || (account && !account.email_verified_at))
    throw new CustomError(400, "Account not found.");
  const isValidPassword = await bcrypt.compare(password, account.password_hash);
  if (!isValidPassword) {
    throw new CustomError(400, "login failed, please check your credential.");
  }
  const accessToken = generateAccessToken({
    account_id: account.id,
    type: account.type,
  });
  return {
    user: sanitizeUser(account),
    accessToken,
  };
};

//============================================

export const createVerificationOtp = async (account_id: string) => {
  await updateInvalidateOldOtp(account_id);
  const otp = generateOtp();
  const otp_hash = await bcrypt.hash(otp, 10);
  const expires_at = new Date(Date.now() + 1000 * 60 * 10);
  await insertOtp(account_id, otp_hash, expires_at);
  return otp;
};

//============================================

export const verifyOtp = async (email: string, otp: string) => {
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
    type: verifiedUser.type as "customer" | "admin",
  });
  return {
    user: sanitizeUser(verifiedUser),
    accessToken,
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
  if (!sendedOtp) throw new CustomError(400, "otp not found.");
  const isValidOtp = await bcrypt.compare(otp, sendedOtp.otp_hash);
  if (!isValidOtp) throw new CustomError(400, "invalid otp.");

  const new_password_hash = await bcrypt.hash(new_password, 10);
  await updateInvalidateOldOtp(user.id);
  await updateUserPassword(user.id, new_password_hash);
};
//============================================
