import Stripe from "stripe";
import { errorHandler } from "../../utils/errorMessage.js";
import { stripe } from "../../utils/stripe.js";
import {
  createPaymentIntentForOrder,
  handleStripeEvent,
} from "./order_payments.service.js";
import { Request, Response } from "express";

export const createPaymentIntentController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const result = await createPaymentIntentForOrder(
      id as string,
      req.user!.id
    );
    return res.status(200).send({ success: true, data: result });
  } catch (e) {
    return errorHandler(e, res);
  }
};

export const stripeWebhookController = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
  }
  try {
    await handleStripeEvent(event);
    res.status(200).send({ received: true });
  } catch (e) {
    return errorHandler(e, res);
  }
};
