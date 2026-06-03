import pool from "../../db/index.js";

export const selectPaymentMethods = async () => {
  const query = `
    SELECT * FROM payment_methods
    WHERE is_active = true
    `;
  const result = await pool.query(query);
  return result.rows;
};

export const selectPaymentMethodById = async (id: string) => {
  const query = `
    SELECT * FROM payment_methods
    WHERE is_active = true AND id = $1
    `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};
