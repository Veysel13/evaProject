import { Request, Response, NextFunction, RequestHandler } from "express";
import { Password } from "../../../services/password";
import { User } from "../../../models/user";
import { BadRequestError } from "../../../errors/bad-request-error";

export const signin: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError("Invalid credentials");
    }

    const passwordsMatch = await Password.compare(
      existingUser.password,
      password
    );
    if (!passwordsMatch) {
      throw new BadRequestError("Invalid Credentials");
    }

    const userJwt = await existingUser.generateToken()

    res.status(200).send({ user: existingUser, token: userJwt });
  } catch (err) {
    next(err);
  }
};
