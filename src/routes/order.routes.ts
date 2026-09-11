import { Router } from "express";
import {
  activeCountriesController,
  countryActiveCitiesController,
} from "../modules/location/location.controller.js";
import { activePackagesController } from "../modules/packages/packages.controller.js";
import { validatorMiddleware } from "../middlewares/validator.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { orderFormSchema } from "../modules/order/order.validation.js";
import { newOrderController } from "../modules/order/order.controller.js";
import { activeBranchesController } from "../modules/branches/branches.controller.js";
import { createPaymentIntentController } from "../modules/order_payments/order_payments.controller.js";
import { activePaymentMethodsController } from "../modules/payment_methods/payment_methods.controller.js";
const router = Router();

router.get("/countries", activeCountriesController);
router.get("/countries/:id/cities", countryActiveCitiesController);
router.get("/packages", activePackagesController);
router.get("/branches", activeBranchesController);
router.get("/payment_methods", activePaymentMethodsController);
router.post(
  "/",
  authMiddleware("customer"),
  validatorMiddleware(orderFormSchema, "body"),
  newOrderController
);
router.post(
  "/:id/pay",
  authMiddleware("customer"),
  createPaymentIntentController
);

export default router;
