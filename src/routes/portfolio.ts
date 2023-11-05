import express from "express";

import { currentUser } from "../middlewares/current-user";
import { requireAuth } from "../middlewares/require-auth";

import {
  index,
  buy,
  sell
} from "../http/controllers/market-instrument/portfolio";

const router = express.Router();

router.get("/api/portfolio", [currentUser,requireAuth], index);

router.post("/api/portfolio/buy", [currentUser,requireAuth], buy);

router.post("/api/portfolio/sell", [currentUser,requireAuth], sell);

export { router as portfolio };
