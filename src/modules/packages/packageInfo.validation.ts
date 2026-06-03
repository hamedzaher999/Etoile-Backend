import z from "zod";

export const packageInfoSchema = z
  .object({
    name: z.string().optional(),
    description: z.string().optional(),
    price: z.number().positive().optional(),
    img_url: z.url().optional(),
    is_Vip_only: z.boolean().optional(),
    is_active: z.boolean().optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "At least one field must be provided",
  });

export type PackageInfo = z.infer<typeof packageInfoSchema>;
