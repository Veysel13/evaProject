import { Request, Response, NextFunction, RequestHandler } from "express";
import { v4 as uuidv4 } from "uuid";
import { MarketInstrument } from "../../../models/market-instrument";
import { MarketInstrumentService } from "../../../services/market-instrument";
import { BadRequestError } from "../../../errors/bad-request-error";

export const index: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const marketInstrumentService=new MarketInstrumentService()

    const marketInstrumentList = await marketInstrumentService.gets({ status: 1 });

    res.status(200).send({ marketInstrumentList: marketInstrumentList });
  } catch (err) {
    next(err);
  }
};

export const store: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, symbol, stock, price, status } = req.body;

    const existingMarketInstrument = await MarketInstrument.findOne({ symbol });

    if (existingMarketInstrument) {
      throw new BadRequestError("Symbol in use");
    }

    const marketInstrument = MarketInstrument.build({
      name,
      symbol,
      stock,
      price,
      code: uuidv4(),
      status: status || 0,
    });
    await marketInstrument.save();

    res.status(201).send({ marketInstrument: marketInstrument });
  } catch (err) {
    next(err);
  }
};

export const show: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { code } = req.params;

    const marketInstrument = await MarketInstrument.findOne({
      code: code,
      status: 1,
    });

    if (!marketInstrument) {
      throw new BadRequestError("Not Found Market Instrument");
    }

    res.status(200).send({ marketInstrument: marketInstrument });
  } catch (err) {
    next(err);
  }
};

export const status: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { code } = req.params;

    const marketInstrument = await MarketInstrument.findOne({
      code: code,
    });

    if (!marketInstrument) {
      throw new BadRequestError("Not Found Market Instrument");
    }

    await MarketInstrument.updateOne(
      { _id: marketInstrument._id },
      {
        status: !marketInstrument.status,
      }
    )
      .then((response) => {
        res.status(200).send({ status: !marketInstrument.status });
      })
      .catch((err) => {
        throw new BadRequestError("Error");
      });
  } catch (err) {
    next(err);
  }
};
