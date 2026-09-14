import pool from "../../db/index.js";
import { PackageCreateInfo, PackageInfo } from "./packageInfo.validation.js";

export const selectActivePackages = async () => {
  const query = `
      SELECT * FROM packages
      WHERE is_active = true AND deleted_at IS NULL`;

  const result = await pool.query(query);
  return result.rows;
};
export const selectAllPackages = async (
  is_active: boolean | null | undefined = undefined
) => {
  let query = `
      SELECT * FROM packages
      WHERE deleted_at IS NULL
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
      WHERE id = $1 AND is_active = true AND deleted_at IS NULL`;

  const result = await pool.query(query, [id]);
  return result.rows[0];
};
export const selectPackageByIdRaw = async (id: string) => {
  const query = `
      SELECT * FROM packages
      WHERE id = $1 AND deleted_at IS NULL`;

  const result = await pool.query(query, [id]);
  return result.rows[0];
};
export const insertPackage = async (info: PackageCreateInfo) => {
  const query = `
    INSERT INTO packages (name, slug, description, price, img_url, is_vip_only, is_active)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *
  `;
  const values = [
    info.name,
    info.slug,
    info.description ?? null,
    info.price,
    info.img_url ?? null,
    info.is_vip_only ?? false,
    info.is_active ?? true,
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const updatePackageInfo = async (
  id: string,
  packageInfo: PackageInfo
) => {
  const query = `UPDATE packages SET 
  name = $1,
  slug = $2,
  description = $3,
  price = $4,
  img_url = $5,
  is_vip_only = $6, 
  is_active = $7
  WHERE id = $8 
  AND deleted_at IS NULL
  RETURNING *
  `;
  const values = [
    packageInfo.name,
    packageInfo.slug,
    packageInfo.description,
    packageInfo.price,
    packageInfo.img_url,
    packageInfo.is_vip_only,
    packageInfo.is_active,
    id,
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};
