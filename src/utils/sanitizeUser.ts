import { User, SanitizedUser } from "../modules/auth/auth.type.js";

export const sanitizeUser = (user: User): SanitizedUser => {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    type: user.type,
    status: user.status,
    channel: user.channel,
    email: user.email,
    number: user.number,
    avatar_url: user.avatar_url,
    is_vip: user.is_vip,
    vip_started_at: user.vip_started_at,
    vip_expired_at: user.vip_expired_at,
    email_verified_at: user.email_verified_at,
    phone_verified_at: user.phone_verified_at,
    created_at: user.created_at,
    deleted_at: user.deleted_at,
  };
};
