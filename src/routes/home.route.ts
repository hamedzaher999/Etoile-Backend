import { Router } from "express";
import {
  Report,
  Review,
  topReviews,
} from "../modules/home/reviews.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { PaymentMethodsController } from "../modules/home/footer.controller.js";
import { validatorMiddleware } from "../middlewares/validator.middleware.js";
import { reportSchema, ReviewSchema } from "../modules/home/validation.js";

export const router = Router();

router.get("/review", topReviews);
router.post(
  "/review",
  authMiddleware("customer"),
  validatorMiddleware(ReviewSchema, "body"),
  Review
);
router.post(
  "/report",
  authMiddleware("customer"),
  validatorMiddleware(reportSchema, "body"),
  Report
);
router.get("/payment_methods", PaymentMethodsController);
export default router;
