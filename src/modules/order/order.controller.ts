import { Request, Response } from "express";
import { errorHandler } from "../../utils/errorMessage.js";
import {
  CancelOrderByClient,
  changeOrderStatus,
  createNewOrder,
  getClientCurrentOrder,
  getClientOrders,
  getOrders,
} from "./order.service.js";
import { OrderStatus } from "./type.js";

export const newOrderController = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const order = await createNewOrder(body, req.user!);
    return res.status(200).send({
      success: true,
      data: order,
    });
  } catch (e) {
    return errorHandler(e, res);
  }
};

export const cancelOrderController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await CancelOrderByClient(id as string, req.user!.id);
    return res.status(200).send({
      success: true,
      data: order,
    });
  } catch (e) {
    return errorHandler(e, res);
  }
};

export const ClientOrdersController = async (req: Request, res: Response) => {
  try {
    const result = await getClientOrders(req.user!.id);
    return res.status(200).send({
      success: true,
      data: result,
    });
  } catch (e) {
    return errorHandler(e, res);
  }
};

export const ClientCurrentOrderController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await getClientCurrentOrder(req.user!.id);
    return res.status(200).send({
      success: true,
      data: result,
    });
  } catch (e) {
    return errorHandler(e, res);
  }
};

// admin
export const ordersController = async (req: Request, res: Response) => {
  try {
    const result = await getOrders(req.query);

    return res.status(200).send({
      success: true,
      data: result,
    });
  } catch (e) {
    return errorHandler(e, res);
  }
};

export const OrderStatusController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await changeOrderStatus(
      id as string,
      req.query.stats as OrderStatus
    );
    return res.status(200).send({
      success: true,
      data: result,
    });
  } catch (e) {
    return errorHandler(e, res);
  }
};
