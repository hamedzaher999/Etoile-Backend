import z from "zod";

export const footerTitleInfoSchema = z.object({
  key: z.string().min(2),
  is_active: z.boolean().optional(),
});

export const footerItemInfoSchema = z.object({
  footer_title_id: z.uuid(),
  name: z.string().min(1),
  reference: z.string().min(1),
  is_active: z.boolean().optional(),
});

export const updateFooterItemInfoSchema = z
  .object({
    name: z.string().min(1).optional(),
    reference: z.string().min(1).optional(),
    is_active: z.boolean().optional(),
  })
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: "At least one field must be provided",
  });

export type FooterTitleInfo = z.infer<typeof footerTitleInfoSchema>;
export type FooterItemInfo = z.infer<typeof footerItemInfoSchema>;
export type UpdateFooterItemInfo = z.infer<typeof updateFooterItemInfoSchema>;
