import z from "zod";

export const packageCreateSchema = z.object({
  name: z.string().min(2, "name must be at least 2 characters"),
  slug: z.string().min(2, "slug must be at least 2 characters"),
  description: z.string().optional(),
  price: z.number().positive("invalid price"),
  img_url: z.url().optional(),
  is_vip_only: z.boolean().optional(),
  is_active: z.boolean().optional(),
});

export const packageInfoSchema = z
  .object({
    name: z.string().min(2).optional(),
    slug: z.string().min(2).optional(),
    description: z.string().optional(),
    price: z.number().positive().optional(),
    img_url: z.url().optional(),
    is_vip_only: z.boolean().optional(),
    is_active: z.boolean().optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "At least one field must be provided",
  });

export type PackageCreateInfo = z.infer<typeof packageCreateSchema>;
export type PackageInfo = z.infer<typeof packageInfoSchema>;
