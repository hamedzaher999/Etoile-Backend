import pool from "../../db/index.js";

export const selectTopReviews = async () => {
  const query = `
      SELECT 
        r.id AS id,
        r.comment AS comment,
        r.created_at AS comment_created_at,
        r.rating AS rating,               
        a.name AS account_name,
        a.id As account_id,
        a.avatar_url AS account_avatar  FROM reviews r
      INNER JOIN accounts a ON r.account_id = a.id 
      WHERE r.is_approved = true 
        AND r.deleted_at IS NULL 
        AND a.status = 'active' 
        AND a.deleted_at IS NULL 
      LIMIT 8;
    `;
  const result = await pool.query(query);
  return result.rows;
};

export const insertReview = async (
  account_id: string,
  comment: string,
  rating: number
) => {
  const query = `INSERT INTO reviews (account_id,comment,rating) 
    VALUES ($1,$2,$3) RETURNING *`;
  const result = await pool.query(query, [account_id, comment, rating]);

  return result.rows[0];
};

export const insertReport = async (account_id: string, report: string) => {
  const query = `INSERT INTO reports (account_id, report) 
    VALUES ($1,$2) RETURNING *`;
  const result = await pool.query(query, [account_id, report]);
  return result.rows[0];
};
