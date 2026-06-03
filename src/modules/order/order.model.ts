import pool from "../../db/index.js";

import { OrderData, OrderFilters, OrderForm, OrderStatus } from "./type.js";

export const insertOrder = async (orderFrom: OrderData, client_id: string) => {
  const {
    payment_method_id,
    payment_method_name,
    city_id,
    package_name,
    country_name,
    city_name,
    country_id,
    delivery_location,
    package_id,
    price,
    receiver_name,
    receiver_phone,
  } = orderFrom;

  const query = `
     INSERT INTO orders (
    client_id,
    payment_method_id,
    package_id,
    package_name,
    country_id,
    country_name,
    city_id,
    city_name,
    price,
    delivery_location,
    receiver_name,
    receiver_phone,
    order_number
    ) 
    VALUES
    ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, nextval('order_number_seq')) RETURNING *`;

  const values = [
    client_id,
    payment_method_id,
    package_id,
    package_name,
    country_id,
    country_name,
    city_id,
    city_name,
    price,
    delivery_location,
    receiver_name,
    receiver_phone,
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
    SELECT * FROM orders 
    WHERE client_id = $1 AND status IN('pending','preparing','shipping','canceled','accepted')
    `;
  const result = await pool.query(query, [client_id]);
  return result.rows[0];
};

export const updateCancelOrderByClient = async (
  id: string,
  client_id: string
) => {
  const query = `
    Update orders SET status = 'canceled' , updated_at = NOW()
    WHERE id = $1 AND client_id = $2 RETURNING *
    `;
  const values = [id, client_id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const selectOrders = async (filters: OrderFilters) => {
  let query = `
    SELECT *
    FROM orders
    WHERE 1=1
  `;

  const values: any[] = [];

  if (filters.status) {
    values.push(filters.status);

    query += `
      AND status = $${values.length}
    `;
  }

  if (filters.client_id) {
    values.push(filters.client_id);

    query += `
      AND client_id = $${values.length}
    `;
  }

  if (filters.country_id) {
    values.push(filters.country_id);

    query += `
      AND country_id = $${values.length}
    `;
  }

  if (filters.package_id) {
    values.push(filters.package_id);

    query += `
      AND package_id = $${values.length}
    `;
  }

  query += `
    ORDER BY created_at DESC
  `;

  const result = await pool.query(query, values);

  return result.rows;
};

export const selectOrderById = async (id: string) => {
  const query = `
    SELECT * FROM orders 
    WHERE id = $1 
    `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

export const selectClientOrderById = async (id: string, client_id: string) => {
  const query = `
    SELECT * FROM orders 
    WHERE id = $1 
    AND client_id = $2
    `;
  const result = await pool.query(query, [id, client_id]);
  return result.rows[0];
};

export const selectClientOrders = async (client_id: string) => {
  const query = `
    SELECT * FROM orders 
    WHERE client_id = $1 
    `;
  const result = await pool.query(query, [client_id]);
  return result.rows;
};

export const selectOrderByStatus = async (status: OrderStatus) => {
  const query = `SELECT * FROM orders
  WHERE status = $1  
  `;
  const result = await pool.query(query, [status]);
  return result.rows;
};

// admin end points

export const UpdateOrder = async (order_id: string, status: OrderStatus) => {
  const query = `
  UPDATE orders
  SET status = $1,
  updated_at=NOW()
  WHERE id = $2 
  AND status <> 'delivered'
  RETURNING *
  `;
  const result = await pool.query(query, [status, order_id]);
  return result.rows[0];
};
