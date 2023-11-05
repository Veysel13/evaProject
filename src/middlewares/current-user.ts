import { Request, Response, NextFunction } from 'express';
import { User } from "../models/user";
import jwt from 'jsonwebtoken';

interface UserPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
 
   if (!req.headers.authorization) {
     return next();
   }
   
  try {

    const token=req.headers.authorization.replace('Bearer ','')

    const payload = jwt.verify(
      token,
      process.env.JWT_KEY!
    ) as UserPayload;

    const user=await User.findOne({_id:payload.id})
    if(user){
      req.currentUser = payload;
    }

    return next();
  } catch (err) {}

  next();
};
