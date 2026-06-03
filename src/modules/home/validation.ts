import z from "zod";

export const ReviewSchema = z.object({
  review: z.string(),
  rating: z.number().min(0, "invalid rating value").max(5, "rate scope 1-5 !!"),
});

export const reportSchema = z.object({
  report: z.string().min(5).max(350, "report is too long"),
});
