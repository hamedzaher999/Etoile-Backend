export interface User {
  id: string;
  name: string;
  username: string;
  type: string;
  status: string;
  channel: string;
  email: string | null;
  number: string | null;
  avatar_url?: string | null;
  password_hash: string;
  is_vip: boolean;
  vip_started_at: Date | null;
  vip_expired_at: Date | null;
  email_verified_at: Date | null;
  phone_verified_at: Date | null;
  created_at: Date;
  deleted_at: Date | null;
}

export interface SanitizedUser {
  id: string;
  name: string;
  username: string;
  type: string;
  status: string;
  channel: string;
  email: string | null;
  number: string | null;
  avatar_url?: string | null;
  is_vip: boolean;
  vip_started_at: Date | null;
  vip_expired_at: Date | null;
  email_verified_at: Date | null;
  phone_verified_at: Date | null;
  created_at: Date;
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
}

export interface Otp {
  id: string;
  account_id: string;
  channel: string;
  otp_hash: string;
  used: boolean;
  expires_at: Date;
  created_at: Date;
}
