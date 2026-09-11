import { CustomError } from "../../utils/customError.js";
import {
  insertReport,
  insertReview,
  selectTopReviews,
} from "./reviews.model.js";

export const createReview = async (
  account_id: string,
  comment: string,
  rating: number
) => {
  const result = await insertReview(account_id, comment, rating);
  if (!result)
    throw new CustomError(500, "some thing went wrong, pleas try again");
  return result;
};

export const getTopReviews = async () => {
  const reviews = await selectTopReviews();
  return reviews;
};

export const createReport = async (account_id: string, report: string) => {
  const result = await insertReport(account_id, report);
  if (!result)
    throw new CustomError(500, "some thing went wrong, pleas try again");
  return result;
};
