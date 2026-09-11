import { Request, Response } from "express";
import { errorHandler } from "../../utils/errorMessage.js";
import {
  getFooterStructure,
  createFooterTitle,
  createFooterItem,
  changeFooterItem,
  deleteFooterItem,
} from "./footer.service.js";

export const footerStructureController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await getFooterStructure();
    return res.status(200).send({ success: true, data: result });
  } catch (e) {
    return errorHandler(e, res);
  }
};

export const footerTitleController = async (req: Request, res: Response) => {
  try {
    const result = await createFooterTitle(req.body);
    return res.status(201).send({ success: true, data: result });
  } catch (e) {
    return errorHandler(e, res);
  }
};

export const footerItemController = async (req: Request, res: Response) => {
  try {
    const result = await createFooterItem(req.body);
    return res.status(201).send({ success: true, data: result });
  } catch (e) {
    return errorHandler(e, res);
  }
};

export const changeFooterItemController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const result = await changeFooterItem(id as string, req.body);
    return res.status(200).send({ success: true, data: result });
  } catch (e) {
    return errorHandler(e, res);
  }
};

export const deleteFooterItemController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const result = await deleteFooterItem(id as string);
    return res.status(200).send({ success: true, data: result });
  } catch (e) {
    return errorHandler(e, res);
  }
};
