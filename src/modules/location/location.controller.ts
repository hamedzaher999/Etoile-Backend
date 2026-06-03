import { Request, Response } from "express";
import {
  changeCityInfo,
  changeCountryInfo,
  getActiveCountries,
  getAllCountries,
  getCountryActiveCities,
  getCountryCities,
} from "./location.service.js";
import { errorHandler } from "../../utils/errorMessage.js";
import { deleteCity, deleteCountry } from "./location.model.js";

export const allCountriesController = async (req: Request, res: Response) => {
  try {
    const { is_active } = req.query;
    const active = is_active !== undefined ? is_active === "true" : undefined;
    const result = await getAllCountries(active);
    return res.status(200).send({
      success: true,
      data: result,
    });
  } catch (e) {
    return errorHandler(e, res);
  }
};

export const activeCountriesController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await getActiveCountries();
    return res.status(200).send({
      success: true,
      data: result,
    });
  } catch (e) {
    return errorHandler(e, res);
  }
};

export const countryActiveCitiesController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const result = await getCountryActiveCities(id as string);
    return res.status(200).send({
      success: true,
      data: result,
    });
  } catch (e) {
    return errorHandler(e, res);
  }
};

export const countryCitiesController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { is_active } = req.query;
    const active = is_active !== undefined ? is_active === "true" : undefined;
    const result = await getCountryCities(id as string, active);
    return res.status(200).send({
      success: true,
      data: result,
    });
  } catch (e) {
    return errorHandler(e, res);
  }
};

export const changeCountryInfoController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const result = await changeCountryInfo(id as string, req.body);
    return res.status(200).send({
      success: true,
      data: result,
    });
  } catch (e) {
    return errorHandler(e, res);
  }
};

export const changeCityInfoController = async (req: Request, res: Response) => {
  try {
    const { cityId } = req.params;
    const result = await changeCityInfo(cityId as string, req.body);
    return res.status(200).send({
      success: true,
      data: result,
    });
  } catch (e) {
    return errorHandler(e, res);
  }
};

export const deleteCountryController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await deleteCountry(id as string);
    return res.status(200).send({
      success: true,
      data: result,
    });
  } catch (e) {
    return errorHandler(e, res);
  }
};

export const deleteCityController = async (req: Request, res: Response) => {
  try {
    const { cityId } = req.params;
    const result = await deleteCity(cityId as string);
    return res.status(200).send({
      success: true,
      data: result,
    });
  } catch (e) {
    return errorHandler(e, res);
  }
};
