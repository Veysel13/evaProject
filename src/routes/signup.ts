import express, { Request, Response } from "express";
import { body } from "express-validator";

import { validateRequest } from "../middlewares/validate-request";

import { signup } from "../http/controllers/auth/signup-controller";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("name").notEmpty().withMessage("Name field is required"),
    body("surname").notEmpty().withMessage("Surname field is required"),
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").trim().isLength({ min: 4, max: 20 }).withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  signup
);

export { router as signupRouter };
