import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  cancelOrderController,
  ClientCurrentOrderController,
  ClientOrdersController,
} from "../modules/order/order.controller.js";

const route = Router();

route.get(
  "/CurrentOrder",
  authMiddleware("customer"),
  ClientCurrentOrderController
);
route.get("/orders", authMiddleware("customer"), ClientOrdersController);
route.delete("/orders/:id", authMiddleware("customer"), cancelOrderController);
export default route;
