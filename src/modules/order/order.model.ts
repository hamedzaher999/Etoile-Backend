import pool from "../../db/index.js";

import { OrderData, OrderFilters, OrderForm, OrderStatus } from "./type.js";
const ORDER_DETAILS_SELECT = `
  SELECT
    o.*,
    p.name AS package_name,
    pm.name AS payment_method_name,
    b.name AS branch_name,
    b.address AS branch_address,
    c.name AS country_name,
    ci.name AS city_name
  FROM orders o
  INNER JOIN packages p ON p.id = o.package_id
  INNER JOIN payment_methods pm ON pm.id = o.payment_method_id
  INNER JOIN branches b ON b.id = o.branch_id
  INNER JOIN countries c ON c.id = b.country_id
  INNER JOIN cities ci ON ci.id = b.city_id
`;

export const insertOrder = async (orderForm: OrderData) => {
  const {
    client_id,
    payment_method_id,
    package_id,
    branch_id,
    price,
    delivery_location,
    contact,
  } = orderForm;

  const query = `
    INSERT INTO orders (
    client_id,
    payment_method_id,
    package_id,
    branch_id,
    price,
    delivery_location,
    contact
    ) 
    VALUES
    ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;

  const values = [
    client_id,
    payment_method_id,
    package_id,
    branch_id,
    price,
    delivery_location,
    contact ?? null,
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const selectPendingOrderByClientId = async (client_id: string) => {
  const query = `
    SELECT * FROM orders 
    WHERE client_id = $1 AND status = 'pending'
    `;
  const result = await pool.query(query, [client_id]);
  return result.rows[0];
};

export const selectCurrentOrderByClientId = async (client_id: string) => {
  const query = `
    ${ORDER_DETAILS_SELECT}
    WHERE o.client_id = $1 
    AND o.status IN ('pending','accepted','payed','canceled')
    ORDER BY o.created_at DESC
    LIMIT 1
    `;
  const result = await pool.query(query, [client_id]);
  return result.rows[0];
};

export const updateCancelOrderByClient = async (
  id: string,
  client_id: string
) => {
  const query = `
    UPDATE orders SET status = 'canceled', updated_at = NOW()
    WHERE id = $1 AND client_id = $2 RETURNING *
    `;
  const values = [id, client_id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const selectOrders = async (filters: OrderFilters) => {
  let query = `${ORDER_DETAILS_SELECT} WHERE 1=1`;

  const values: any[] = [];

  if (filters.status) {
    values.push(filters.status);
    query += ` AND o.status = $${values.length}`;
  }

  if (filters.client_id) {
    values.push(filters.client_id);
    query += ` AND o.client_id = $${values.length}`;
  }

  if (filters.branch_id) {
    values.push(filters.branch_id);
    query += ` AND o.branch_id = $${values.length}`;
  }

  if (filters.package_id) {
    values.push(filters.package_id);
    query += ` AND o.package_id = $${values.length}`;
  }

  query += ` ORDER BY o.created_at DESC`;

  const result = await pool.query(query, values);
  return result.rows;
};

export const selectOrderById = async (id: string) => {
  const query = `${ORDER_DETAILS_SELECT} WHERE o.id = $1`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

export const selectClientOrderById = async (id: string, client_id: string) => {
  const query = `${ORDER_DETAILS_SELECT} WHERE o.id = $1 AND o.client_id = $2`;
  const result = await pool.query(query, [id, client_id]);
  return result.rows[0];
};

export const selectClientOrders = async (client_id: string) => {
  const query = `${ORDER_DETAILS_SELECT} WHERE o.client_id = $1 ORDER BY o.created_at DESC`;
  const result = await pool.query(query, [client_id]);
  return result.rows;
};

export const UpdateOrder = async (order_id: string, status: OrderStatus) => {
  const query = `
  UPDATE orders
  SET status = $1,
  updated_at = NOW()
  WHERE id = $2 
  AND status <> 'delivered'
  RETURNING *
  `;
  const result = await pool.query(query, [status, order_id]);
  return result.rows[0];
};
