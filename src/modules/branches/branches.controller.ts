import { errorHandler } from "../../utils/errorMessage.js";
import {
  getActiveBranches,
  getAllBranches,
  createBranch,
  changeBranchInfo,
  deleteBranch,
} from "./branches.service.js";
import { Response, Request } from "express";
export const activeBranchesController = async (req: Request, res: Response) => {
  try {
    const result = await getActiveBranches();
    return res.status(200).send({ success: true, data: result });
  } catch (e) {
    return errorHandler(e, res);
  }
};

export const allBranchesController = async (req: Request, res: Response) => {
  try {
    const result = await getAllBranches();
    return res.status(200).send({ success: true, data: result });
  } catch (e) {
    return errorHandler(e, res);
  }
};

export const branchInfoController = async (req: Request, res: Response) => {
  try {
    const result = await createBranch(req.body);
    return res.status(201).send({ success: true, data: result });
  } catch (e) {
    return errorHandler(e, res);
  }
};

export const changeBranchInfoController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const result = await changeBranchInfo(id as string, req.body);
    return res.status(200).send({ success: true, data: result });
  } catch (e) {
    return errorHandler(e, res);
  }
};

export const deleteBranchController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await deleteBranch(id as string);
    return res.status(200).send({ success: true, data: result });
  } catch (e) {
    return errorHandler(e, res);
  }
};
