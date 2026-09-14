import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  allPackagesController,
  createPackageController,
  packageInfoController,
} from "../modules/packages/packages.controller.js";
import {
  changeCityInfoController,
  changeCountryInfoController,
  deleteCityController,
  deleteCountryController,
  allCountriesController,
  countryCitiesController,
  createCityController,
  createCountryController,
} from "../modules/location/location.controller.js";
import { validatorMiddleware } from "../middlewares/validator.middleware.js";
import {
  cityInfoSchema,
  countryInfoSchema,
  newCityInfoSchema,
  newCountryInfoSchema,
} from "../modules/location/location.validation.js";
import {
  ordersController,
  OrderStatusController,
} from "../modules/order/order.controller.js";
import {
  packageCreateSchema,
  packageInfoSchema,
} from "../modules/packages/packageInfo.validation.js";
import {
  allBranchesController,
  branchInfoController,
  changeBranchInfoController,
  deleteBranchController,
} from "../modules/branches/branches.controller.js";
import {
  branchInfoSchema,
  updateBranchInfoSchema,
} from "../modules/branches/branches.validation.js";
import {
  footerTitleController,
  footerItemController,
  changeFooterItemController,
  deleteFooterItemController,
} from "../modules/footer/footer.controller.js";
import {
  footerTitleInfoSchema,
  footerItemInfoSchema,
  updateFooterItemInfoSchema,
} from "../modules/footer/footer.validation.js";
import { orderStatusSchema } from "../modules/order/order.validation.js";
import {
  allPaymentMethodsController,
  createPaymentMethodController,
  paymentMethodInfoController,
  deletePaymentMethodController,
} from "../modules/payment_methods/payment_methods.controller.js";
import {
  paymentMethodInfoSchema,
  updatePaymentMethodInfoSchema,
} from "../modules/payment_methods/payment_methods.validation.js";
import {
  createSettingController,
  settingByBranchController,
  settingInfoController,
  restartSettingController,
} from "../modules/settings/settings.controller.js";
import {
  settingInfoSchema,
  updateSettingInfoSchema,
} from "../modules/settings/settings.validation.js";
const route = Router();

route.get("/packages", authMiddleware("admin"), allPackagesController);
route.post(
  "/packages",
  authMiddleware("admin"),
  validatorMiddleware(packageCreateSchema, "body"),
  createPackageController
);
route.patch(
  "/packages/:id",
  authMiddleware("admin"),
  validatorMiddleware(packageInfoSchema, "body"),
  packageInfoController
);
//-------------
route.get("/countries", authMiddleware("admin"), allCountriesController);
route.post(
  "/countries",
  authMiddleware("admin"),
  validatorMiddleware(newCountryInfoSchema, "body"),
  createCountryController
);
route.post(
  "/countries/:id/cities",
  authMiddleware("admin"),
  validatorMiddleware(newCityInfoSchema, "body"),
  createCityController
);
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
  validatorMiddleware(cityInfoSchema, "body"),
  changeCityInfoController
);
route.delete(
  "/countries/:countryId/cities/:cityId",
  authMiddleware("admin"),
  deleteCityController
);
//-------------
route.get("/branches", authMiddleware("admin"), allBranchesController);
route.post(
  "/branches",
  authMiddleware("admin"),
  validatorMiddleware(branchInfoSchema, "body"),
  branchInfoController
);
route.patch(
  "/branches/:id",
  authMiddleware("admin"),
  validatorMiddleware(updateBranchInfoSchema, "body"),
  changeBranchInfoController
);
route.delete("/branches/:id", authMiddleware("admin"), deleteBranchController);
//-------------
route.get(
  "/payment_methods",
  authMiddleware("admin"),
  allPaymentMethodsController
);
route.post(
  "/payment_methods",
  authMiddleware("admin"),
  validatorMiddleware(paymentMethodInfoSchema, "body"),
  createPaymentMethodController
);
route.patch(
  "/payment_methods/:id",
  authMiddleware("admin"),
  validatorMiddleware(updatePaymentMethodInfoSchema, "body"),
  paymentMethodInfoController
);
route.delete(
  "/payment_methods/:id",
  authMiddleware("admin"),
  deletePaymentMethodController
);
//-------------
route.post(
  "/footer/titles",
  authMiddleware("admin"),
  validatorMiddleware(footerTitleInfoSchema, "body"),
  footerTitleController
);
route.post(
  "/footer/items",
  authMiddleware("admin"),
  validatorMiddleware(footerItemInfoSchema, "body"),
  footerItemController
);
route.patch(
  "/footer/items/:id",
  authMiddleware("admin"),
  validatorMiddleware(updateFooterItemInfoSchema, "body"),
  changeFooterItemController
);
route.delete(
  "/footer/items/:id",
  authMiddleware("admin"),
  deleteFooterItemController
);
//-------------
route.post(
  "/settings",
  authMiddleware("admin"),
  validatorMiddleware(settingInfoSchema, "body"),
  createSettingController
);
route.get(
  "/settings/:branchId",
  authMiddleware("admin"),
  settingByBranchController
);
route.patch(
  "/settings/:branchId",
  authMiddleware("admin"),
  validatorMiddleware(updateSettingInfoSchema, "body"),
  settingInfoController
);
route.post(
  "/settings/:branchId/restart",
  authMiddleware("admin"),
  restartSettingController
);
//-------------
route.get("/orders", authMiddleware("admin"), ordersController);
route.patch(
  "/orders/:id",
  authMiddleware("admin"),
  validatorMiddleware(orderStatusSchema, "body"),
  OrderStatusController
);

export default route;
