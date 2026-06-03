import z from "zod";

export const orderFormSchema = z.object({
  payment_method_id: z.uuid("payment method not found."),
  package_id: z.uuid("selected package not found."),
  country_id: z.uuid("selected country not found."),
  city_id: z.uuid("selected city not found."),
  price: z.number("invalid price"),
  delivery_location: z
    .string()
    .trim()
    .min(10, "Please enter a more detailed delivery location"),
  receiver_phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9]+$/, "Phone number must contain only numbers")
    .min(5, "Phone number is too short")
    .max(12, "Phone number is too long"),

  receiver_name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters long")
    .max(50, "Name is too long"),

  reference: z.string(),
});

export const countryIdSchema = z.object({
  country_id: z.uuid("selected country not found."),
});

export const PackageInfoSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters long")
    .max(50, "Name is too long"),

  description: z.string(),
  price: z.number("invalid price"),
  img_url: z.string().trim(),
  is_Vip_only: z.boolean(),
  is_active: z.boolean(),
});
