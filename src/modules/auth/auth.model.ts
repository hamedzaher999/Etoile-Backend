import pool from "../../db/index.js";
import { CustomError } from "../../utils/customError.js";
import { User, EmailVerificationOtp } from "./auth.type.js";

interface CreateEmailVerificationOtpParams {
  account_id: string;
  otp_hash: string;
  expires_at: Date;
}
interface CreateUserInterface {
  name: string;
  username: string;
  email: string;
  password_hash: string;
}

//=======================================================

export const insertEmailVerificationOtp = async (
  account_id: string,
  otp_hash: string,
  expires_at: Date
): Promise<EmailVerificationOtp> => {
  const query = `INSERT INTO email_verification_otps (
    account_id,
    otp_hash,
    expires_at
  )
  VALUES ($1,$2,$3) RETURNING * `;
  const values = [account_id, otp_hash, expires_at];
  const result = await pool.query(query, values);
  if (!result) {
    throw new CustomError(500, "some thing went wrong.");
  }
  return result.rows[0];
};

//=======================================================

export const selectUserByEmail = async (email: string) => {
  const query = `SELECT * FROM accounts 
    WHERE email = $1 `;
  const result = await pool.query(query, [email]);
  console.log(result.rows[0]);
  return result.rows[0];
};

//=======================================================

export const selectUserById = async (id: string) => {
  const query = `
  SELECT * FROM accounts WHERE id = $1
  `;
  const result = await pool.query(query, [id]);
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

export const selectLatestOtpByAccountId = async (account_id: string) => {
  const query = `SELECT * FROM email_verification_otps
  WHERE account_id = $1
  AND used = false
  ORDER BY created_at DESC LIMIT 1`;

  const result = pool.query(query, [account_id]);
  return (await result).rows[0];
};

//=======================================================

export const updateOtpAsUsed = async (
  otp_id: string
): Promise<EmailVerificationOtp> => {
  const query = `UPDATE email_verification_otps
   SET used=true
   WHERE id=$1
   RETURNING * `;

  const result = await pool.query(query, [otp_id]);
  return result.rows[0];
};

//=======================================================

export const updateInvalidateOldOtp = async (account_id: string) => {
  const query = `
    UPDATE email_verification_otps
    SET used = true
    WHERE account_id = $1
    AND used = false
  `;

  await pool.query(query, [account_id]);
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
export const insertRefreshToken = async (
  account_id: string,
  replaced_by_token_id: string | null = null,
  token_hash: string,
  expires_at: Date,
  ip_address?: string,
  device_name?: string,
  user_agent?: string
) => {
  const query = `
    INSERT INTO refresh_tokens (
      account_id,
      replaced_by_token_id,
      token_hash,
      expires_at,
      ip_address,
      device_name,
      user_agent
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING id, account_id, expires_at, created_at
  `;

  const values = [
    account_id,
    replaced_by_token_id,
    token_hash,
    expires_at,
    ip_address,
    device_name,
    user_agent,
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};
//=======================================================

export const updateRevokeAllRefreshToken = async (account_id: string) => {
  const query = `UPDATE  refresh_tokens 
  SET is_revoked = true WHERE 
  account_id = $1 
  AND is_revoked = false`;
  await pool.query(query, [account_id]);
};

//=======================================================
export const selectRefreshTokenByHash = async (token_hash: string) => {
  const query = `
    SELECT *
    FROM refresh_tokens
    WHERE token_hash = $1 AND is_revoked = false
    AND expires_at > NOW()
    LIMIT 1
  `;
  const result = await pool.query(query, [token_hash]);
  return result.rows[0];
};
//=======================================================
export const updateRevokeRefreshTokenById = async (id: string) => {
  const query = `
    UPDATE refresh_tokens
    SET is_revoked = true
    WHERE id = $1
  `;

  await pool.query(query, [id]);
};
//=======================================================

export const updateRevokeRefreshTokenByHash = async (
  refreshToken_hash: string
) => {
  const query = `
    UPDATE refresh_tokens
    SET is_revoked = true
    WHERE token_hash = $1
  `;

  await pool.query(query, [refreshToken_hash]);
};
//=======================================================
export const updateRevokeExpiredRefreshTokens = async () => {
  const query = `
    UPDATE refresh_tokens
    SET is_revoked = true
    WHERE expires_at <= NOW()
      AND is_revoked = false
  `;

  await pool.query(query);
};
//=======================================================
export const deleteCleanupRefreshTokens = async () => {
  const query = `
    DELETE FROM refresh_tokens
    WHERE
      (
        expires_at <= NOW()
        OR is_revoked = true
      )
      AND created_at < NOW() - INTERVAL '7 days'
  `;

  const result = await pool.query(query);

  return {
    deleted: result.rowCount,
  };
};

//=======================================================
