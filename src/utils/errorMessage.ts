import e, { Response } from "express";
import { UNKNOWN_ERROR } from "../constant/errors.js";
import { CustomError } from "./customError.js";

export const errorMessage = (error: any): string => {
  if (!error) return UNKNOWN_ERROR;
  const message = error instanceof Error ? error?.message : UNKNOWN_ERROR;
  return message;
};

export const errorhandler = (
  error: any
): { statusCode: number; message: string; extraData: any } => {
  if (!error)
    return {
      statusCode: 500,
      message: UNKNOWN_ERROR,
      extraData: null,
    };

  const message = error instanceof Error ? error?.message : UNKNOWN_ERROR;
  const statusCode = error instanceof CustomError ? error?.statusCode : 500;
  const extraData = error instanceof CustomError ? error?.extraData : null;
  return {
    message,
    statusCode,
    extraData,
  };
};

export const errorHandler = (error: any, res: Response): Response => {
  if (!error)
    return res.status(500).send({
      success: false,
      message: UNKNOWN_ERROR,
    });
  const message = error instanceof Error ? error?.message : UNKNOWN_ERROR;
  const statusCode = error instanceof CustomError ? error?.statusCode : 500;
  const extraData = error instanceof CustomError ? error?.extraData : null;

  return res.status(statusCode).send({
    success: false,
    message,
  });
};
