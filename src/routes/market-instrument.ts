import express from "express";
import { body } from "express-validator";

import { validateRequest } from "../middlewares/validate-request";

import { currentUser } from "../middlewares/current-user";
import { requireAuth } from "../middlewares/require-auth";

import {
  index,
  store,
  show,
  status,
} from "../http/controllers/market-instrument/market-instrument";

const router = express.Router();

router.get("/api/market-instrument", [currentUser, requireAuth], index);

router.post(
  "/api/market-instrument",
  [
    body("stock").trim().isInt().withMessage("Stock must be numeric"),
    body("price").trim().isFloat().withMessage("Prime must be decimal"),
    body("symbol")
      .trim()
      .isLength({ min: 3, max: 3 })
      .withMessage("Symbol must be 3 characters"),
  ],
  [validateRequest, currentUser, requireAuth],
  store
);

router.get("/api/market-instrument/:code", [currentUser, requireAuth], show);

router.put(
  "/api/market-instrument/:code/status",
  [currentUser, requireAuth],
  status
);

export { router as marketInstrument };
