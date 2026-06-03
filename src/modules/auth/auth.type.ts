export interface User {
  id: string;
  name: string;
  username: string;
  type: string;
  status: string;
  email: string;
  avatar_url?: string | null;
  email_verified_at: Date | null;
  is_vip: boolean;
  password_hash: string;
  created_at: Date;
  updated_at: Date | null;
  deleted_at: Date | null;
}
export interface SanitizedUser {
  id: string;
  name: string;
  username: string;
  type: string;
  status: string;
  email: string;
  avatar_url?: string | null;
  email_verified_at: Date | null;
  is_vip: boolean;
  created_at: Date;
  updated_at: Date | null;
  deleted_at: Date | null;
}

export interface Admin {
  id: string;
  name: string;
  username: string;
  type: "admin";
  status: "active";
  email: string;
  avatar_url?: string | null;
  email_verified_at: Date;
  created_at: Date;
  updated_at: Date | null;
}

export interface EmailVerificationOtp {
  id: string;
  account_id: string;
  otp_hash: string;
  used: boolean;
  expires_at: Date;
  created_at: Date;
}
