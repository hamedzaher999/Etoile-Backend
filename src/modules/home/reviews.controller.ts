import { Request, Response } from "express";

import { errorHandler } from "../../utils/errorMessage.js";
import {
  createReport,
  createReview,
  getTopReviews,
} from "./reviews.service.js";

export const topReviews = async (_req: Request, res: Response) => {
  try {
    const data = await getTopReviews();
    res.status(200).send({
      success: true,
      data: data,
    });
  } catch (e) {
    return errorHandler(e, res);
  }
};
export const Review = async (req: Request, res: Response) => {
  try {
    const { review, rating } = req.body;
    await createReview(req.user!.id, review, rating);
    res.status(200).send({
      success: true,
      message: "your review was submitted successfully.",
    });
  } catch (e) {
    return errorHandler(e, res);
  }
};

export const Report = async (req: Request, res: Response) => {
  try {
    const { report } = req.body;
    await createReport(req.user!.id, report);
    res.status(200).send({
      success: true,
      message:
        "your report was submitted successfully. thank you for your time",
    });
  } catch (e) {
    return errorHandler(e, res);
  }
};
