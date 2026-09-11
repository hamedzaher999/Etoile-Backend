import z from "zod";
export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "name should be at least 2 characters")
    .max(50, "name is to long"),
  email: z.email("Invalid email format."),
  username: z.string().min(3),
  password: z.string().min(8, "password must be at least 8 characters."),
});

export const loginSchema = z.object({
  email: z.email("Invalid email format."),
  password: z.string().min(8, "password must be at least 8 characters."),
});

export const verifyOtpSchema = z.object({
  email: z.email(),
  otp: z.string().length(6),
});

export const changePasswordSchema = z.object({
  email: z.email("Invalid email format."),
  otp: z.string().length(6),
  new_password: z.string().min(8, "password must be at least 8 characters."),
});
