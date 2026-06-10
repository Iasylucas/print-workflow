import { Request, Response, NextFunction } from "express";

export const sanitizeEmptyStrings = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.body && typeof req.body === "object") {
    Object.keys(req.body).forEach((key) => {
      if (req.body[key] === "") {
        req.body[key] = null;
      }
    });
  }
  next();
};
