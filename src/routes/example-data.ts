import express, { Request, Response } from "express";

import { exampleData } from "../http/controllers/example-data/example-data-controller";

const router = express.Router();

router.post("/api/example-data", exampleData);

export { router as exampleDataRouter };
