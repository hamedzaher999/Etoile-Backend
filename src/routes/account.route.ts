import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  ClientCurrentOrderController,
  ClientOrdersController,
} from "../modules/order/order.controller.js";

const route = Router();

route.get(
  "/CurrentOrder",
  authMiddleware("customer"),
  ClientCurrentOrderController
);
route.get("/", authMiddleware("customer"), ClientOrdersController);

export default route;
