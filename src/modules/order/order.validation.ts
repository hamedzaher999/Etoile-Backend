import z from "zod";

export const orderFormSchema = z.object({
  payment_method_id: z.uuid("payment method not found."),
  package_id: z.uuid("selected package not found."),
  branch_id: z.uuid("selected branch not found."),
  delivery_location: z
    .string()
    .trim()
    .min(10, "Please enter a more detailed delivery location"),
  contact: z
    .string()
    .trim()
    .regex(/^\+?[0-9]+$/, "contact must contain only numbers")
    .min(5, "contact is too short")
    .max(15, "contact is too long")
    .optional(),
});

export const orderStatusSchema = z.object({
  status: z.enum(["pending", "accepted", "payed", "delivered", "canceled"]),
});
