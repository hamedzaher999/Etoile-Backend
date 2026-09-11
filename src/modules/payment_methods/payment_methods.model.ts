import pool from "../../db/index.js";
import { PaymentMethodInfo } from "./payment_methods.validation.js";

export const selectActivePaymentMethods = async () => {
  const query = `SELECT * FROM payment_methods WHERE is_active = true AND deleted_at IS NULL`;
  const result = await pool.query(query);
  return result.rows;
};

export const selectAllPaymentMethods = async () => {
  const query = `SELECT * FROM payment_methods WHERE deleted_at IS NULL`;
  const result = await pool.query(query);
  return result.rows;
};

export const selectPaymentMethodById = async (id: string) => {
  const query = `SELECT * FROM payment_methods WHERE id = $1 AND is_active = true AND deleted_at IS NULL`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

export const selectPaymentMethodByIdRaw = async (id: string) => {
  const query = `SELECT * FROM payment_methods WHERE id = $1 AND deleted_at IS NULL`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

export const insertPaymentMethod = async (info: PaymentMethodInfo) => {
  const query = `INSERT INTO payment_methods (name, is_online, is_active)
  VALUES ($1,$2,$3) RETURNING *`;
  const values = [info.name, info.is_online ?? false, info.is_active ?? true];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const updatePaymentMethod = async (
  id: string,
  info: PaymentMethodInfo
) => {
  const query = `UPDATE payment_methods SET
  name = $1,
  is_online = $2,
  is_active = $3
  WHERE id = $4
  AND deleted_at IS NULL
  RETURNING *
  `;
  const values = [info.name, info.is_online, info.is_active, id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const deletePaymentMethodById = async (id: string) => {
  const query = `UPDATE payment_methods SET
  deleted_at = NOW(),
  is_active = FALSE
  WHERE id = $1
  AND deleted_at IS NULL
  RETURNING *
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};
