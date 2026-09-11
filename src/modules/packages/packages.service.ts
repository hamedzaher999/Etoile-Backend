import { CustomError } from "../../utils/customError.js";
import { PackageCreateInfo, PackageInfo } from "./packageInfo.validation.js";
import {
  selectPackageById,
  selectActivePackages,
  updatePackageInfo,
  selectAllPackages,
  insertPackage,
} from "./packages.model.js";
export const getActivePackages = async () => {
  const result = await selectActivePackages();
  return result;
};

export const getAllPackages = async ({
  is_active,
}: {
  is_active?: boolean;
}) => {
  const result = await selectAllPackages(is_active);
  return result;
};

export const getPackageById = async (id: string) => {
  const result = await selectPackageById(id);
  if (!result) throw new CustomError(400, "bad inputs.");
  return result;
};

export const createPackage = async (info: PackageCreateInfo) => {
  const result = await insertPackage(info);
  if (!result) throw new CustomError(500, "package creation failed.");
  return result;
};

export const changePackageInfo = async (
  package_id: string,
  packageInfo: PackageInfo
) => {
  const selectedPackage = await selectPackageById(package_id);
  if (!selectedPackage) throw new CustomError(400, "package not found.");

  const newData: PackageInfo = {
    ...selectedPackage,
    ...packageInfo,
  };
  const result = await updatePackageInfo(package_id, newData);
  if (!result) throw new CustomError(500, "pleas try again.");
  return result;
};
