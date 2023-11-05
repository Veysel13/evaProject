import { Request, Response, NextFunction, RequestHandler } from "express";

export const me: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    res.send({ currentUser: req.currentUser || null });
  } catch (err) {
    next(err);
  }
}
