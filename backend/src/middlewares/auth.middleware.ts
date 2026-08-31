import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "@/config/env.js";
import { UnauthorizedError, ForbiddenError } from "@/shared/error/error.js";
import { JWTpayload } from "@/features/auth/auth.types.js";
import { AUTH_ERRORS } from "@/features/auth/auth.constants.js";

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw new UnauthorizedError(AUTH_ERRORS.NOT_LOGGED_IN);
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new UnauthorizedError(AUTH_ERRORS.NO_TOKEN_PROVIDED);
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JWTpayload;

    if (!decoded.sub) {
      throw new UnauthorizedError("Invalid token payload");
    }

    req.user = decoded;

    next();
  } catch (error) {
    throw new UnauthorizedError(AUTH_ERRORS.INVALID_TOKEN);
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ForbiddenError(AUTH_ERRORS.FORBIDDEN);
    }
    next();
  };
};
