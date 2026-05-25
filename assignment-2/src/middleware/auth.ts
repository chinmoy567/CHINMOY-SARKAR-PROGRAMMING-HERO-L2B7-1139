import type { NextFunction, Request, Response } from "express";

import jwt from "jsonwebtoken";
import config from "../config";

const auth = (...requiredRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      // no token
      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized access",
        });
      }

      // verify token
      const decoded = jwt.verify(token, config.jwt_access_secret) as any;

      req.user = decoded;

      // role checking
      if (requiredRoles.length && !requiredRoles.includes(decoded.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden access",
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
