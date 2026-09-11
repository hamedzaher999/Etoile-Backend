import { Router } from "express";
import {
  Report,
  Review,
  topReviews,
} from "../modules/home/reviews.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validatorMiddleware } from "../middlewares/validator.middleware.js";
import { reportSchema, ReviewSchema } from "../modules/home/validation.js";
import { footerStructureController } from "../modules/footer/footer.controller.js";
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
router.get("/footer", footerStructureController);

export default router;
