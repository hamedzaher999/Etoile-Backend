import { PoolClient } from "pg";
import pool from "./index.js";

export const withTransaction = async <T>(
  transactions: (client: PoolClient) => Promise<T>
) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await transactions(client);
    await client.query("COMMIT");
    return result;
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
};
