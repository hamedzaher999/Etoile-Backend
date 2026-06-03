import z, { object } from "zod";

export const loginSchema = z.object({
  email: z.email("Invalid email format."),
  password: z.string().min(8, "password must be at least 8 characters."),
});
