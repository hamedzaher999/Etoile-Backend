import { SanitizedUser, User } from "../modules/auth/auth.type.js";

export const sanitizeUser = (user: User): SanitizedUser => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    username: user.username,
    type: user.type,
    avatar_url: user.avatar_url,
    is_vip: user.is_vip,
    created_at: user.created_at,
    status: user.status,
    updated_at: user.updated_at,
    deleted_at: user.deleted_at,
    email_verified_at: user.email_verified_at,
  };
};
