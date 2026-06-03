import { id } from "zod/locales";
import pool from "../../db/index.js";
import { countryInfo } from "./location.validation.js";
import { City } from "./locations.types.js";

export const selectActiveCountries = async () => {
  const query = `SELECT * FROM countries 
  WHERE is_active = true 
  AND deleted_at IS NULL`;

  const result = await pool.query(query);
  return result.rows;
};

export const selectallCountries = async (is_active?: boolean) => {
  let query = `SELECT * FROM countries 
  WHERE deleted_at IS NULL`;
  const values: any[] = [];
  if (is_active !== null && is_active !== undefined) {
    query += ` AND is_active = $1`;
    values.push(is_active);
  }
  const result = await pool.query(query, values);
  return result.rows;
};

export const selectActiveCountryById = async (id: string) => {
  const query = `SELECT * FROM countries WHERE id=$1 AND is_active = true AND deleted_at IS NULL`;
  const response = await pool.query(query, [id]);
  return response.rows[0];
};
export const selectCountryById = async (id: string) => {
  const query = `SELECT * FROM countries WHERE id=$1 AND deleted_at IS NULL`;
  const response = await pool.query(query, [id]);
  return response.rows[0];
};

export const selectActiveCityById = async (id: string) => {
  const query = `SELECT * FROM cities WHERE id = $1 AND is_active = true AND deleted_at IS NULL`;
  const response = await pool.query(query, [id]);
  return response.rows[0];
};

export const selectCityById = async (id: string) => {
  const query = `
  SELECT * FROM cities 
  WHERE id = $1
  AND deleted_at IS NULL`;
  const response = await pool.query(query, [id]);
  return response.rows[0];
};

export const selectActiveCitiesByCountryId = async (country_id: string) => {
  const query = `SELECT * FROM cities 
  WHERE country_id = $1 
  AND is_active = true
  AND deleted_at IS NULL
  ;`;
  const result = await pool.query(query, [country_id]);
  return result.rows;
};

export const selectAllCitiesByCountryId = async (
  country_id: string,
  is_Active?: boolean
) => {
  let query = `SELECT * FROM cities 
  WHERE country_id = $1 
  AND deleted_at IS NULL
  ;`;
  const values: any[] = [country_id];
  if (is_Active !== null && is_Active !== undefined) {
    query += ` AND is_active = $2`;
    values.push(is_Active);
  }
  const result = await pool.query(query, values);
  return result.rows;
};
export const updateCountryInfo = async (
  id: string,
  countryInfo: countryInfo
) => {
  const query = `UPDATE countries SET
  name = $1 ,
  code = $2 ,
  is_active = $3
  WHERE id = $4 
  AND deleted_at IS NULL
  RETURNING *
  `;
  const values = [
    countryInfo.name,
    countryInfo.code,
    countryInfo.is_active,
    id,
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const deleteCountry = async (id: string) => {
  const query = `UPDATE countries SET
  deleted_at = NOW(),
  is_active = FALSE
  WHERE id = $1
  AND deleted_at IS NULL
  RETURNING *
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

export const deleteCity = async (id: string) => {
  const query = `UPDATE cities SET
  deleted_at = NOW(),
  is_active = FALSE
  WHERE id = $1
  AND deleted_at IS NULL
  RETURNING *
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};
export const updateCityInfo = async (id: string, cityInfo: City) => {
  const query = `UPDATE cities SET
  name = $1 ,
  is_active = $2
  WHERE id = $3
  AND deleted_at IS NULL
  RETURNING *
  `;
  const values = [cityInfo.name, cityInfo.is_active, id];
  const result = await pool.query(query, values);
  return result.rows[0];
};
