import { Request, Response } from "express";

import { errorHandler } from "../../utils/errorMessage.js";
import {
  changePackageInfo,
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
    const result = await getAllPackages(req.query);

    return res.status(200).send({ success: true, data: result });
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
