import { CustomError } from "../../utils/customError.js";
import {
  selectActivePaymentMethods,
  selectAllPaymentMethods,
  insertPaymentMethod,
  selectPaymentMethodByIdRaw,
  updatePaymentMethod,
  deletePaymentMethodById,
} from "./payment_methods.model.js";
import {
  PaymentMethodInfo,
  UpdatePaymentMethodInfo,
} from "./payment_methods.validation.js";

export const getActivePaymentMethods = async () => {
  return await selectActivePaymentMethods();
};

export const getAllPaymentMethods = async () => {
  return await selectAllPaymentMethods();
};

export const createPaymentMethod = async (info: PaymentMethodInfo) => {
  const result = await insertPaymentMethod(info);
  if (!result) throw new CustomError(500, "try again.");
  return result;
};

export const changePaymentMethodInfo = async (
  id: string,
  new_info: UpdatePaymentMethodInfo
) => {
  const method = await selectPaymentMethodByIdRaw(id);
  if (!method) throw new CustomError(404, "payment method not found.");
  const info = { ...method, ...new_info };
  const result = await updatePaymentMethod(id, info);
  if (!result) throw new CustomError(500, "try again.");
  return result;
};

export const deletePaymentMethod = async (id: string) => {
  const method = await selectPaymentMethodByIdRaw(id);
  if (!method) throw new CustomError(404, "payment method not found.");
  const result = await deletePaymentMethodById(id);
  if (!result) throw new CustomError(500, "try again.");
  return result;
};
