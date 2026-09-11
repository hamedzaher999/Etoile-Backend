import { CustomError } from "../../utils/customError.js";
import {
  selectSettingByBranchId,
  insertSetting,
  updateSetting,
  restartBranchSetting,
  incrementRequestedOrders,
  closeBranchSetting,
} from "./settings.model.js";
import { SettingInfo, UpdateSettingInfo } from "./settings.validation.js";

export const getSettingByBranchId = async (branch_id: string) => {
  const setting = await selectSettingByBranchId(branch_id);
  if (!setting)
    throw new CustomError(404, "settings not found for this branch.");
  return setting;
};

export const createSetting = async (info: SettingInfo) => {
  const existing = await selectSettingByBranchId(info.branch_id);
  if (existing)
    throw new CustomError(400, "settings already exist for this branch.");
  const result = await insertSetting(info);
  if (!result) throw new CustomError(500, "try again.");
  return result;
};

export const changeSettingInfo = async (
  branch_id: string,
  new_info: UpdateSettingInfo
) => {
  const setting = await getSettingByBranchId(branch_id);
  const info = { ...setting, ...new_info };
  const result = await updateSetting(branch_id, info);
  if (!result) throw new CustomError(500, "try again.");
  return result;
};

export const restartSetting = async (branch_id: string) => {
  await getSettingByBranchId(branch_id);
  const result = await restartBranchSetting(branch_id);
  if (!result) throw new CustomError(500, "try again.");
  return result;
};

export const registerOrderAgainstSettings = async (
  branch_id: string,
  is_vip: boolean
) => {
  const setting = await getSettingByBranchId(branch_id);
  if (!setting.is_open)
    throw new CustomError(400, "this branch is currently closed for orders.");

  const updated = await incrementRequestedOrders(branch_id, is_vip);

  const classicFull =
    updated.requested_classic_orders >= updated.max_classic_orders;
  const vipFull = updated.requested_vip_orders >= updated.max_vip_orders;

  if (classicFull && vipFull) {
    await closeBranchSetting(branch_id);
  }
};
