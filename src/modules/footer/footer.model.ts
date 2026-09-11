import pool from "../../db/index.js";
import { FooterTitleInfo, FooterItemInfo } from "./footer.validation.js";

export const selectFooterStructure = async () => {
  const query = `
    SELECT 
      t.id AS title_id,
      t.key AS title_key,
      i.id AS item_id,
      i.name AS item_name,
      i.reference AS item_reference
    FROM footer_titles t
    LEFT JOIN footer_items i 
      ON i.footer_title_id = t.id 
      AND i.is_active = true 
      AND i.deleted_at IS NULL
    WHERE t.is_active = true 
      AND t.deleted_at IS NULL
    ORDER BY t.created_at ASC, i.created_at ASC
  `;
  const result = await pool.query(query);
  return result.rows;
};

export const insertFooterTitle = async (info: FooterTitleInfo) => {
  const query = `INSERT INTO footer_titles (key, is_active) VALUES ($1,$2) RETURNING *`;
  const result = await pool.query(query, [info.key, info.is_active ?? true]);
  return result.rows[0];
};

export const insertFooterItem = async (info: FooterItemInfo) => {
  const query = `INSERT INTO footer_items (footer_title_id, name, reference, is_active)
  VALUES ($1,$2,$3,$4) RETURNING *`;
  const values = [
    info.footer_title_id,
    info.name,
    info.reference,
    info.is_active ?? true,
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const selectFooterItemById = async (id: string) => {
  const query = `SELECT * FROM footer_items WHERE id = $1 AND deleted_at IS NULL`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

export const updateFooterItem = async (id: string, info: FooterItemInfo) => {
  const query = `UPDATE footer_items SET
  name = $1,
  reference = $2,
  is_active = $3
  WHERE id = $4
  AND deleted_at IS NULL
  RETURNING *
  `;
  const values = [info.name, info.reference, info.is_active, id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const deleteFooterItemById = async (id: string) => {
  const query = `UPDATE footer_items SET
  deleted_at = NOW(),
  is_active = FALSE
  WHERE id = $1
  AND deleted_at IS NULL
  RETURNING *
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};
