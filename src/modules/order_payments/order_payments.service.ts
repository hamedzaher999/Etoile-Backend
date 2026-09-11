import Stripe from "stripe";
import { CustomError } from "../../utils/customError.js";
import { stripe } from "../../utils/stripe.js";
import { selectClientOrderById, UpdateOrder } from "../order/order.model.js";
import { selectPaymentMethodByIdRaw } from "../payment_methods/payment_methods.model.js";
import {
  selectOrderPaymentByOrderId,
  insertOrderPayment,
  selectOrderPaymentByIntentId,
  updateOrderPaymentStatus,
} from "./order_payments.model.js";

export const createPaymentIntentForOrder = async (
  order_id: string,
  client_id: string
) => {
  const order = await selectClientOrderById(order_id, client_id);
  if (!order) throw new CustomError(404, "order not found.");
  if (!["pending", "accepted"].includes(order.status))
    throw new CustomError(400, "this order cannot be paid for right now.");

  const payment_method = await selectPaymentMethodByIdRaw(
    order.payment_method_id
  );
  if (!payment_method || !payment_method.is_online)
    throw new CustomError(
      400,
      "this order's payment method does not use online payment."
    );

  const existing = await selectOrderPaymentByOrderId(order_id);
  if (existing && existing.status === "success")
    throw new CustomError(400, "this order is already paid.");

  const intent = await stripe.paymentIntents.create({
    amount: Math.round(Number(order.price) * 100),
    currency: "usd",
    metadata: { order_id: order.id },
  });

  await insertOrderPayment(
    order.id,
    order.payment_method_id,
    "stripe",
    intent.id,
    order.price
  );

  return { client_secret: intent.client_secret };
};

export const handleStripeEvent = async (event: Stripe.Event) => {
  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object as Stripe.PaymentIntent;
    const payment = await selectOrderPaymentByIntentId(intent.id);
    if (!payment) return;
    await updateOrderPaymentStatus(payment.id, "success", intent as any);
    await UpdateOrder(payment.order_id, "payed");
  }

  if (event.type === "payment_intent.payment_failed") {
    const intent = event.data.object as Stripe.PaymentIntent;
    const payment = await selectOrderPaymentByIntentId(intent.id);
    if (!payment) return;
    await updateOrderPaymentStatus(payment.id, "failed", intent as any);
  }
};
