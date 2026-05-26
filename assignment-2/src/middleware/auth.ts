import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import sendResponse from "../utils/sendResponse";

const auth = (...requiredRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      // no token
      if (!token) {
        sendResponse(res, 401, false, "Unauthorized access");
        return;
      }

      // verify token
      const decoded = jwt.verify(token, config.jwt_access_secret) as any;

      req.user = decoded;

      // role checking
      if (requiredRoles.length && !requiredRoles.includes(decoded.role)) {
        sendResponse(res, 403, false, "Forbidden access");
        return;
          
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
