import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  allPackagesController,
  packageInfoController,
} from "../modules/packages/packages.controller.js";
import {
  changeCityInfoController,
  changeCountryInfoController,
  activeCountriesController,
  deleteCityController,
  deleteCountryController,
  allCountriesController,
  countryCitiesController,
} from "../modules/location/location.controller.js";
import { validatorMiddleware } from "../middlewares/validator.middleware.js";
import { countryInfoSchema } from "../modules/location/location.validation.js";
import {
  ordersController,
  OrderStatusController,
} from "../modules/order/order.controller.js";
import { packageInfoSchema } from "../modules/packages/packageInfo.validation.js";

const route = Router();

route.get("/packages", authMiddleware("admin"), allPackagesController);
route.patch(
  "/packages/:id",
  authMiddleware("admin"),
  validatorMiddleware(packageInfoSchema, "body"),
  packageInfoController
);
//-------------
route.get("/countries", authMiddleware("admin"), allCountriesController);
route.patch(
  "/countries/:id",
  authMiddleware("admin"),
  validatorMiddleware(countryInfoSchema, "body"),
  changeCountryInfoController
);
route.delete(
  "/countries/:id",
  authMiddleware("admin"),
  deleteCountryController
);

route.get(
  "/countries/:id/cities",
  authMiddleware("admin"),
  countryCitiesController
);
route.patch(
  "/countries/:countryId/cities/:cityId",
  authMiddleware("admin"),
  changeCityInfoController
);
route.delete(
  "/countries/:countryId/cities/:cityId",
  authMiddleware("admin"),
  deleteCityController
);

route.get("/orders", authMiddleware("admin"), ordersController);
route.patch("/orders", authMiddleware("admin"), OrderStatusController);

export default route;
