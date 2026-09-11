import pool from "../../db/index.js";
import { CustomError } from "../../utils/customError.js";
import { User, Otp } from "./auth.type.js";

interface CreateUserInterface {
  name: string;
  username: string;
  email: string;
  password_hash: string;
}

//=======================================================

export const selectUserByEmail = async (email: string) => {
  const query = `SELECT * FROM accounts 
    WHERE email = $1 
    AND deleted_at IS NULL`;
  const result = await pool.query(query, [email]);
  return result.rows[0];
};

//=======================================================

export const selectUserById = async (id: string) => {
  const query = `
  SELECT * FROM accounts 
  WHERE id = $1 
  AND deleted_at IS NULL
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

//=======================================================

export const insertUser = async ({
  name,
  username,
  email,
  password_hash,
}: CreateUserInterface): Promise<User> => {
  const query = `INSERT INTO accounts (
    name,
    username,
    email,
    password_hash
  )
  VALUES ($1,$2,$3,$4)
  RETURNING *
  `;
  const values = [name, username, email, password_hash];
  const result = await pool.query(query, values);
  return result.rows[0];
};

//=======================================================

export const updateVerifyUserEmail = async (
  account_id: string
): Promise<User> => {
  const query = `
    UPDATE accounts
    SET email_verified_at = NOW()
    WHERE id = $1
    RETURNING *
  `;

  const result = await pool.query(query, [account_id]);

  return result.rows[0];
};

//=======================================================

export const updateUserPassword = async (
  account_id: string,
  password_hash: string
): Promise<User> => {
  const query = `
    UPDATE accounts
    SET password_hash = $1
    WHERE id = $2
    RETURNING *
  `;

  const result = await pool.query(query, [password_hash, account_id]);

  return result.rows[0];
};

//=======================================================

export const insertOtp = async (
  account_id: string,
  otp_hash: string,
  expires_at: Date,
  channel: "email" | "phone" = "email"
): Promise<Otp> => {
  const query = `INSERT INTO otps (
    account_id,
    channel,
    otp_hash,
    expires_at
  )
  VALUES ($1,$2,$3,$4) RETURNING * `;
  const values = [account_id, channel, otp_hash, expires_at];
  const result = await pool.query(query, values);
  if (!result) {
    throw new CustomError(500, "some thing went wrong.");
  }
  return result.rows[0];
};

//=======================================================

export const selectLatestOtpByAccountId = async (account_id: string) => {
  const query = `SELECT * FROM otps
  WHERE account_id = $1
  AND used = false
  ORDER BY created_at DESC LIMIT 1`;

  const result = pool.query(query, [account_id]);
  return (await result).rows[0];
};

//=======================================================

export const updateOtpAsUsed = async (otp_id: string): Promise<Otp> => {
  const query = `UPDATE otps
   SET used=true
   WHERE id=$1
   RETURNING * `;

  const result = await pool.query(query, [otp_id]);
  return result.rows[0];
};

//=======================================================

export const updateInvalidateOldOtp = async (account_id: string) => {
  const query = `
    UPDATE otps
    SET used = true
    WHERE account_id = $1
    AND used = false
  `;

  await pool.query(query, [account_id]);
};

//=======================================================
