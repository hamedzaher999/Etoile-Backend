import {
  insertOrder,
  selectClientOrderById,
  selectClientOrders,
  selectCurrentOrderByClientId,
  selectOrderById,
  selectOrders,
  selectPendingOrderByClientId,
  updateCancelOrderByClient,
  UpdateOrder,
} from "./order.model.js";
import { CustomError } from "../../utils/customError.js";
import { selectPackageById } from "../packages/packages.model.js";
import { SanitizedUser } from "../auth/auth.type.js";
import { OrderData, OrderFilters, OrderForm, OrderStatus } from "./type.js";
import { selectBranchById } from "../branches/branches.model.js";
import { registerOrderAgainstSettings } from "../settings/settings.service.js";
import { selectPaymentMethodById } from "../payment_methods/payment_methods.model.js";
export const createNewOrder = async (
  orderForm: OrderForm,
  user: SanitizedUser
) => {
  const selectedPackage = await selectPackageById(orderForm.package_id);

  if (!selectedPackage)
    throw new CustomError(400, "please select a valid package");
  if (selectedPackage?.is_vip_only && !user.is_vip) {
    throw new CustomError(
      400,
      "order denied, this package is only available for our vip client."
    );
  }
  const activeOrder = await selectPendingOrderByClientId(user.id);
  if (activeOrder)
    throw new CustomError(400, "sorry, you already have an order");

  const branch = await selectBranchById(orderForm.branch_id);
  if (!branch || !branch.is_active)
    throw new CustomError(400, "selected branch is not available.");

  const payment_method = await selectPaymentMethodById(
    orderForm.payment_method_id
  );
  if (!payment_method || !payment_method.is_active)
    throw new CustomError(400, "bad inputs");

  await registerOrderAgainstSettings(
    orderForm.branch_id,
    !!selectedPackage.is_vip_only
  );

  const info: OrderData = {
    client_id: user.id,
    payment_method_id: orderForm.payment_method_id,
    package_id: orderForm.package_id,
    branch_id: orderForm.branch_id,
    price: selectedPackage.price,
    delivery_location: orderForm.delivery_location,
    contact: orderForm.contact,
  };
  const order = await insertOrder(info);
  if (!order) throw new CustomError(500, "order failed, pleas try again");
  return order;
};

export const CancelOrderByClient = async (id: string, client_id: string) => {
  const order = await selectClientOrderById(id, client_id);
  if (!order) throw new CustomError(404, "order not found");
  if (!["pending", "accepted"].includes(order.status))
    throw new CustomError(400, "sorry, you cannot cancel this order");
  const result = await updateCancelOrderByClient(id, client_id);
  if (!result)
    throw new CustomError(500, "failed to cancel the order, pleas try again");
  return result;
};

export const getClientCurrentOrder = async (client_id: string) => {
  const order = await selectCurrentOrderByClientId(client_id);
  return order;
};

export const getClientOrders = async (client_id: string) => {
  const order = (await selectClientOrders(client_id)) || [];
  return order;
};

// admin
const transitions: Partial<Record<OrderStatus, OrderStatus[]>> = {
  pending: ["accepted", "canceled"],
  accepted: ["payed", "canceled"],
  payed: ["delivered"],
};

export const getOrders = async (filters: OrderFilters) => {
  return await selectOrders(filters);
};

export const changeOrderStatus = async (
  order_id: string,
  status: OrderStatus
) => {
  const order = await selectOrderById(order_id);

  if (!order) {
    throw new CustomError(400, "order not found.");
  }

  const allowedTransitions = transitions[order.status as OrderStatus] || [];

  if (!allowedTransitions.includes(status)) {
    throw new CustomError(400, "invalid transition.");
  }

  return await UpdateOrder(order_id, status);
};
