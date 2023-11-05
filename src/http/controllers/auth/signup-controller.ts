import { Request, Response, NextFunction, RequestHandler } from "express";
import { User } from "../../../models/user";
import { BadRequestError } from "../../../errors/bad-request-error";

export const signup: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, surname, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("Email in use");
    }

    const user = User.build({ name, surname, email, password });
    await user.save();

    const userJwt = await user.generateToken()

    res.status(201).send({ user: user, token: userJwt });
  } catch (err) {
    next(err);
  }
};
