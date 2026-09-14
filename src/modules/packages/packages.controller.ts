import { Request, Response } from "express";

import { errorHandler } from "../../utils/errorMessage.js";
import {
  changePackageInfo,
  createPackage,
  getActivePackages,
  getAllPackages,
} from "./packages.service.js";
export const activePackagesController = async (req: Request, res: Response) => {
  try {
    const result = await getActivePackages();

    return res.status(200).send({ success: true, data: result });
  } catch (e) {
    return errorHandler(e, res);
  }
};

export const allPackagesController = async (req: Request, res: Response) => {
  try {
    const { is_active } = req.query;
    const active = is_active !== undefined ? is_active === "true" : undefined;
    const result = await getAllPackages({ is_active: active });

    return res.status(200).send({ success: true, data: result });
  } catch (e) {
    return errorHandler(e, res);
  }
};

export const createPackageController = async (req: Request, res: Response) => {
  try {
    const result = await createPackage(req.body);
    res.status(201).send({ success: true, data: result });
  } catch (e) {
    return errorHandler(e, res);
  }
};

export const packageInfoController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await changePackageInfo(id as string, req.body);
    res.status(200).send({
      success: true,
      data: result,
    });
  } catch (e) {
    return errorHandler(e, res);
  }
};
