import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import sendResponse from "../../utils/sendResponse";
import { createIssueIntoDB } from "./issues.service";

export const createIssue = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await createIssueIntoDB(req.body, req.user!.id);

    sendResponse(
      res,
      StatusCodes.CREATED,
      true,
      "Issue created successfully",
      result,
    );
  } catch (error) {
    next(error);
  }
};
