import { selectPaymentMethods } from "./footer.model.js";

export const getPaymentMethods = async () => {
  const result = await selectPaymentMethods();
  return result;
};
