import { Request, Response } from "express";
import { errorHandler } from "../../utils/errorMessage.js";
import {
  getSettingByBranchId,
  createSetting,
  changeSettingInfo,
  restartSetting,
} from "./settings.service.js";

export const settingByBranchController = async (
  req: Request,
  res: Response
) => {
  try {
    const { branchId } = req.params;
    const result = await getSettingByBranchId(branchId as string);
    return res.status(200).send({ success: true, data: result });
  } catch (e) {
    return errorHandler(e, res);
  }
};

export const createSettingController = async (req: Request, res: Response) => {
  try {
    const result = await createSetting(req.body);
    return res.status(201).send({ success: true, data: result });
  } catch (e) {
    return errorHandler(e, res);
  }
};

export const settingInfoController = async (req: Request, res: Response) => {
  try {
    const { branchId } = req.params;
    const result = await changeSettingInfo(branchId as string, req.body);
    return res.status(200).send({ success: true, data: result });
  } catch (e) {
    return errorHandler(e, res);
  }
};

export const restartSettingController = async (req: Request, res: Response) => {
  try {
    const { branchId } = req.params;
    const result = await restartSetting(branchId as string);
    return res.status(200).send({ success: true, data: result });
  } catch (e) {
    return errorHandler(e, res);
  }
};
