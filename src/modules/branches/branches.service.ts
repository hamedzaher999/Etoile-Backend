import { CustomError } from "../../utils/customError.js";
import {
  selectActiveBranches,
  selectAllBranches,
  selectBranchById,
  insertBranch,
  updateBranch,
  deleteBranchById,
} from "./branches.model.js";
import { BranchInfo, UpdateBranchInfo } from "./branches.validation.js";

export const getActiveBranches = async () => {
  return await selectActiveBranches();
};

export const getAllBranches = async () => {
  return await selectAllBranches();
};

export const getBranchById = async (id: string) => {
  const branch = await selectBranchById(id);
  if (!branch) throw new CustomError(404, "branch not found.");
  return branch;
};

export const createBranch = async (info: BranchInfo) => {
  const result = await insertBranch(info);
  if (!result) throw new CustomError(500, "branch creation failed, try again.");
  return result;
};

export const changeBranchInfo = async (
  id: string,
  new_info: UpdateBranchInfo
) => {
  const branch = await selectBranchById(id);
  if (!branch) throw new CustomError(404, "branch not found.");
  const info = { ...branch, ...new_info };
  const result = await updateBranch(id, info);
  if (!result) throw new CustomError(500, "try again.");
  return result;
};

export const deleteBranch = async (id: string) => {
  const branch = await selectBranchById(id);
  if (!branch) throw new CustomError(404, "branch not found.");
  const result = await deleteBranchById(id);
  if (!result) throw new CustomError(500, "try again.");
  return result;
};
