import pool from "../../db/index.js";
import { SettingInfo } from "./settings.validation.js";

export const selectSettingByBranchId = async (branch_id: string) => {
  const query = `SELECT * FROM settings WHERE branch_id = $1`;
  const result = await pool.query(query, [branch_id]);
  return result.rows[0];
};

export const insertSetting = async (info: SettingInfo) => {
  const query = `INSERT INTO settings (branch_id, max_classic_orders, max_vip_orders)
  VALUES ($1,$2,$3) RETURNING *`;
  const values = [info.branch_id, info.max_classic_orders, info.max_vip_orders];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const updateSetting = async (
  branch_id: string,
  info: { is_open: boolean; max_classic_orders: number; max_vip_orders: number }
) => {
  const query = `UPDATE settings SET
  is_open = $1,
  max_classic_orders = $2,
  max_vip_orders = $3
  WHERE branch_id = $4
  RETURNING *
  `;
  const values = [
    info.is_open,
    info.max_classic_orders,
    info.max_vip_orders,
    branch_id,
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const incrementRequestedOrders = async (
  branch_id: string,
  is_vip: boolean
) => {
  const column = is_vip ? "requested_vip_orders" : "requested_classic_orders";
  const query = `
    UPDATE settings
    SET ${column} = ${column} + 1
    WHERE branch_id = $1
    RETURNING *
  `;
  const result = await pool.query(query, [branch_id]);
  return result.rows[0];
};

export const closeBranchSetting = async (branch_id: string) => {
  const query = `
    UPDATE settings
    SET is_open = false, closes_at = NOW()
    WHERE branch_id = $1
    RETURNING *
  `;
  const result = await pool.query(query, [branch_id]);
  return result.rows[0];
};

export const restartBranchSetting = async (branch_id: string) => {
  const query = `
    UPDATE settings
    SET is_open = true,
        closes_at = NULL,
        requested_classic_orders = 0,
        requested_vip_orders = 0,
        restarted_at = NOW()
    WHERE branch_id = $1
    RETURNING *
  `;
  const result = await pool.query(query, [branch_id]);
  return result.rows[0];
};
