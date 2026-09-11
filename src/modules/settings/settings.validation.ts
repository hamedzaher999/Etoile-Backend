import z from "zod";

export const settingInfoSchema = z.object({
  branch_id: z.uuid(),
  max_classic_orders: z.number().int().min(0),
  max_vip_orders: z.number().int().min(0),
});

export const updateSettingInfoSchema = z
  .object({
    is_open: z.boolean().optional(),
    max_classic_orders: z.number().int().min(0).optional(),
    max_vip_orders: z.number().int().min(0).optional(),
  })
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: "At least one field must be provided",
  });

export type SettingInfo = z.infer<typeof settingInfoSchema>;
export type UpdateSettingInfo = z.infer<typeof updateSettingInfoSchema>;
