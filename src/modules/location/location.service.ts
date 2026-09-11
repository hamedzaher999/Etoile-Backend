import { CustomError } from "../../utils/customError.js";
import {
  selectActiveCountries,
  selectActiveCountryById,
  updateCityInfo,
  updateCountryInfo,
  selectallCountries,
  selectActiveCitiesByCountryId,
  selectAllCitiesByCountryId,
  selectCountryById,
  selectCityById,
  deleteCountryById,
  deleteCityById,
} from "./location.model.js";
import { cityInfo, countryInfo } from "./location.validation.js";

export const getActiveCountries = async () => {
  const result = await selectActiveCountries();
  return result;
};

export const getAllCountries = async (is_active?: boolean) => {
  const result = await selectallCountries(is_active);
  return result;
};

export const getCountryActiveCities = async (id: string) => {
  const country = await selectActiveCountryById(id);
  if (!country || !country.is_active)
    throw new CustomError(400, "invalid selected country");
  const result = await selectActiveCitiesByCountryId(id);
  if (!result) throw new CustomError(500, "try again.");
  return result;
};

export const getCountryCities = async (id: string, is_Active?: boolean) => {
  const country = await selectActiveCountryById(id);
  if (!country || !country.is_active)
    throw new CustomError(400, "invalid selected country");
  const result = await selectAllCitiesByCountryId(id, is_Active);
  if (!result) throw new CustomError(500, "try again.");
  return result;
};

export const changeCountryInfo = async (id: string, new_info: countryInfo) => {
  const country = await selectCountryById(id);
  if (!country) throw new CustomError(404, "country not found.");
  const info = {
    ...country,
    ...new_info,
  };
  const result = await updateCountryInfo(id, info);
  if (!result) throw new CustomError(500, "try again.");
  return result;
};

export const changeCityInfo = async (id: string, new_info: cityInfo) => {
  const city = await selectCityById(id);
  if (!city) throw new CustomError(404, "country not found.");
  const info = {
    ...city,
    ...new_info,
  };
  const result = await updateCityInfo(id, info);
  if (!result) throw new CustomError(500, "try again.");
  return result;
};

export const deleteCountry = async (id: string) => {
  const country = await selectCountryById(id);
  if (!country) throw new CustomError(404, "country not found.");
  const result = await deleteCountryById(id);
  if (!result) throw new CustomError(500, "try again.");
  return result;
};
export const deleteCity = async (id: string) => {
  const country = await selectCityById(id);
  if (!country) throw new CustomError(404, "country not found.");
  const result = await deleteCityById(id);
  if (!result) throw new CustomError(500, "try again.");
  return result;
};
