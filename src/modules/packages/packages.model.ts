import pool from "../../db/index.js";
import { PackageInfo } from "./packageInfo.validation.js";

export const selectActivePackages = async () => {
  const query = `
      SELECT * FROM packages
      WHERE is_active = true`;

  const result = await pool.query(query);
  return result.rows;
};
export const selectAllPackages = async (
  is_active: boolean | null | undefined = true
) => {
  let query = `
      SELECT * FROM packages
      WHERE 1 = 1
      `;
  const values: any[] = [];
  if (is_active !== null && is_active !== undefined) {
    values.push(is_active);
    query += " AND is_active = $1";
  }
  const result = await pool.query(query, values);
  return result.rows;
};
export const selectPackageById = async (id: string) => {
  const query = `
      SELECT * FROM packages
      WHERE id = $1 AND is_active = true`;

  const result = await pool.query(query, [id]);
  return result.rows[0];
};

export const updatePackageInfo = async (
  id: string,
  packageInfo: PackageInfo
) => {
  const query = `UPDATE packages SET 
  name = $1,
  description = $2,
  price = $3,
  img_url = $4,
  is_Vip_only = $5, 
  is_active = $6
  WHERE id = $7 
  RETURNING *
  `;
  const values = [
    packageInfo.name,
    packageInfo.description,
    packageInfo.price,
    packageInfo.img_url,
    packageInfo.is_Vip_only,
    packageInfo.is_active,
    id,
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};
