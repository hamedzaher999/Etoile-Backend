import z from "zod";
export const countryInfoSchema = z
  .object({
    name: z.string().optional(),
    code: z.string().optional(),
    is_active: z.boolean().optional(),
  })
  .refine((data) => Object.values(data).some((o) => o !== undefined), {
    message: "At least one field must be provided",
  });

export const cityInfoSchema = z
  .object({
    name: z.string().optional(),
    is_active: z.boolean().optional(),
  })
  .refine((data) => Object.values(data).some((o) => o !== undefined), {
    message: "At least one field must be provided",
  });

export const newCountryInfoSchema = z.object({
  name: z.string(),
  code: z.string(),
  is_active: z.boolean(),
});
export const newCityInfoSchema = z.object({
  name: z.string(),
  is_active: z.boolean().optional(),
});

export type countryInfo = z.infer<typeof countryInfoSchema>;
export type cityInfo = z.infer<typeof cityInfoSchema>;
export type newCountryInfo = z.infer<typeof newCountryInfoSchema>;
export type newCityInfo = z.infer<typeof newCityInfoSchema>;
