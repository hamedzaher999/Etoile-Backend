import pool from "../../db/index.js";
import { BranchInfo } from "./branches.validation.js";

export const selectActiveBranches = async () => {
  const query = `SELECT * FROM branches WHERE is_active = true AND deleted_at IS NULL`;
  const result = await pool.query(query);
  return result.rows;
};

export const selectAllBranches = async () => {
  const query = `SELECT * FROM branches WHERE deleted_at IS NULL`;
  const result = await pool.query(query);
  return result.rows;
};

export const selectBranchById = async (id: string) => {
  const query = `SELECT * FROM branches WHERE id = $1 AND deleted_at IS NULL`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

export const insertBranch = async (branch: BranchInfo) => {
  const query = `INSERT INTO branches (
    country_id, city_id, address, latitude, longitude, name, description, is_active
  )
  VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
  RETURNING *`;
  const values = [
    branch.country_id,
    branch.city_id,
    branch.address,
    branch.latitude ?? null,
    branch.longitude ?? null,
    branch.name,
    branch.description ?? null,
    branch.is_active ?? true,
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const updateBranch = async (id: string, branch: BranchInfo) => {
  const query = `UPDATE branches SET
  country_id = $1,
  city_id = $2,
  address = $3,
  latitude = $4,
  longitude = $5,
  name = $6,
  description = $7,
  is_active = $8
  WHERE id = $9
  AND deleted_at IS NULL
  RETURNING *
  `;
  const values = [
    branch.country_id,
    branch.city_id,
    branch.address,
    branch.latitude ?? null,
    branch.longitude ?? null,
    branch.name,
    branch.description ?? null,
    branch.is_active,
    id,
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const deleteBranchById = async (id: string) => {
  const query = `UPDATE branches SET
  deleted_at = NOW(),
  is_active = FALSE
  WHERE id = $1
  AND deleted_at IS NULL
  RETURNING *
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};
