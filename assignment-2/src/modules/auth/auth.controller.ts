import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import sendResponse from "../../utils/sendResponse";
import { loginUserFromDB, signupUserIntoDB } from "./auth.service";

export const signupUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await signupUserIntoDB(req.body);

    sendResponse(
      res,
      StatusCodes.CREATED,
      true,
      "User registered successfully",
      result,
    );
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await loginUserFromDB(req.body);

    sendResponse(res, StatusCodes.OK, true, "Login successful", result);
  } catch (error) {
    next(error);
  }
};
