import { Request, Response } from "express";
import { errorHandler } from "../../utils/errorMessage.js";
import { getPaymentMethods } from "./footer.service.js";

export const PaymentMethodsController = async (req: Request, res: Response) => {
  try {
    const result = await getPaymentMethods();

    return res.status(200).send({
      success: true,
      data: result,
    });
  } catch (e) {
    return errorHandler(e, res);
  }
};
