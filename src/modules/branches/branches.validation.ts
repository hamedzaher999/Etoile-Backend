import z from "zod";

export const branchInfoSchema = z.object({
  country_id: z.uuid(),
  city_id: z.uuid(),
  address: z.string().min(3),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  name: z.string().min(2),
  description: z.string().optional(),
  is_active: z.boolean().optional(),
});

export const updateBranchInfoSchema = z
  .object({
    country_id: z.uuid().optional(),
    city_id: z.uuid().optional(),
    address: z.string().min(3).optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    name: z.string().min(2).optional(),
    description: z.string().optional(),
    is_active: z.boolean().optional(),
  })
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: "At least one field must be provided",
  });

export type BranchInfo = z.infer<typeof branchInfoSchema>;
export type UpdateBranchInfo = z.infer<typeof updateBranchInfoSchema>;
