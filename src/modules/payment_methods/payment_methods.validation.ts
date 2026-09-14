import z from "zod";
export const paymentMethodInfoSchema = z.object({
  name: z.string().min(2, "name must be at least 2 characters"),
  is_online: z.boolean().optional(),
  is_active: z.boolean().optional(),
  img_url: z.url().optional(),
});

export const updatePaymentMethodInfoSchema = z
  .object({
    name: z.string().min(2).optional(),
    is_online: z.boolean().optional(),
    is_active: z.boolean().optional(),
    img_url: z.url().optional(),
  })
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: "At least one field must be provided",
  });

export type PaymentMethodInfo = z.infer<typeof paymentMethodInfoSchema>;
export type UpdatePaymentMethodInfo = z.infer<
  typeof updatePaymentMethodInfoSchema
>;
