import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../utils/sendResponse";
import {
  createIssueIntoDB,
  deleteIssueFromDB,
  getIssuesFromDB,
  getSingleIssueFromDB,
  updateIssueIntoDB,
} from "./issues.service";

// create issue
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

// get all issues
export const getIssues = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await getIssuesFromDB(req.query);

    sendResponse(
      res,
      StatusCodes.OK,
      true,
      "Issues retrieved successfully",
      result,
    );
  } catch (error) {
    next(error);
  }
};

// get single issue
export const getSingleIssue = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await getSingleIssueFromDB(Number(req.params.id));

    sendResponse(
      res,
      StatusCodes.OK,
      true,
      "Issue retrieved successfully",
      result,
    );
  } catch (error) {
    next(error);
  }
};

// update issue
export const updateIssue = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await updateIssueIntoDB(
      Number(req.params.id),
      req.body,
      req.user!,
    );

    sendResponse(
      res,
      StatusCodes.OK,
      true,
      "Issue updated successfully",
      result,
    );
  } catch (error) {
    next(error);
  }
};

// delete issue
export const deleteIssue = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await deleteIssueFromDB(Number(req.params.id));

    sendResponse(res, StatusCodes.OK, true, "Issue deleted successfully");
  } catch (error) {
    next(error);
  }
};
