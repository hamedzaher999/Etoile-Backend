import { Request, Response } from "express";
import { errorHandler } from "../../utils/errorMessage.js";
import {
  getActivePaymentMethods,
  getAllPaymentMethods,
  createPaymentMethod,
  changePaymentMethodInfo,
  deletePaymentMethod,
} from "./payment_methods.service.js";

export const activePaymentMethodsController = async (
  _req: Request,
  res: Response
) => {
  try {
    const result = await getActivePaymentMethods();
    return res.status(200).send({ success: true, data: result });
  } catch (e) {
    return errorHandler(e, res);
  }
};

export const allPaymentMethodsController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await getAllPaymentMethods();
    return res.status(200).send({ success: true, data: result });
  } catch (e) {
    return errorHandler(e, res);
  }
};

export const createPaymentMethodController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await createPaymentMethod(req.body);
    return res.status(201).send({ success: true, data: result });
  } catch (e) {
    return errorHandler(e, res);
  }
};

export const paymentMethodInfoController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const result = await changePaymentMethodInfo(id as string, req.body);
    return res.status(200).send({ success: true, data: result });
  } catch (e) {
    return errorHandler(e, res);
  }
};

export const deletePaymentMethodController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const result = await deletePaymentMethod(id as string);
    return res.status(200).send({ success: true, data: result });
  } catch (e) {
    return errorHandler(e, res);
  }
};
