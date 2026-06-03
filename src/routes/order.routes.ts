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
const router = Router();

router.get("/countries", activeCountriesController);
//
router.post("countries/id:/cities", countryActiveCitiesController);
router.get("/packages", activePackagesController);
router.post(
  "/",
  authMiddleware,
  validatorMiddleware(orderFormSchema, "body"),
  newOrderController
);

export default router;
