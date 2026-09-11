import pool from "../../db/index.js";

export const insertOrderPayment = async (
  order_id: string,
  payment_method_id: string,
  provider: string,
  provider_intent_id: string,
  amount: number
) => {
  const query = `
    INSERT INTO order_payments (order_id, payment_method_id, provider, provider_intent_id, amount)
    VALUES ($1,$2,$3,$4,$5)
    RETURNING *
  `;
  const values = [
    order_id,
    payment_method_id,
    provider,
    provider_intent_id,
    amount,
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const selectOrderPaymentByIntentId = async (
  provider_intent_id: string
) => {
  const query = `SELECT * FROM order_payments WHERE provider_intent_id = $1`;
  const result = await pool.query(query, [provider_intent_id]);
  return result.rows[0];
};

export const selectOrderPaymentByOrderId = async (order_id: string) => {
  const query = `SELECT * FROM order_payments WHERE order_id = $1 ORDER BY created_at DESC LIMIT 1`;
  const result = await pool.query(query, [order_id]);
  return result.rows[0];
};

export const updateOrderPaymentStatus = async (
  id: string,
  status: "pending" | "success" | "failed",
  metadata?: object
) => {
  const query = `
    UPDATE order_payments
    SET status = $1,
        paid_at = CASE WHEN $1 = 'success' THEN NOW() ELSE paid_at END,
        metadata = COALESCE($2, metadata)
    WHERE id = $3
    RETURNING *
  `;
  const values = [status, metadata ? JSON.stringify(metadata) : null, id];
  const result = await pool.query(query, values);
  return result.rows[0];
};
