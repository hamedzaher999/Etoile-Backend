import express from "express";
import authRoutes from "./routes/aut.routes.js";
import homeRoutes from "./routes/home.route.js";
import orderRoutes from "./routes/order.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import AccountRoutes from "./routes/account.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { stripeWebhookController } from "./modules/order_payments/order_payments.controller.js";
const app = express();
app.use(cors({ origin: true, credentials: true }));
app.post(
  "/webhooks/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhookController
);
app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRoutes);
app.use("/home", homeRoutes);
app.use("/order", orderRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/account", AccountRoutes);
app.get("/", (req, res) => {});

export default app;
