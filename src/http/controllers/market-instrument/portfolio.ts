import { Request, Response, NextFunction, RequestHandler } from "express";
import { MarketInstrument } from "../../../models/market-instrument";
import { Portfolio } from "../../../models/portfolio";
import { BadRequestError } from "../../../errors/bad-request-error";
import { MarketInstrumentService } from "../../../services/market-instrument";
import { PortfolioService } from "../../../services/portfolio";

export const index: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const portfolioService = new PortfolioService();
    const portfolios = await portfolioService.gets({
      user_id: req.currentUser!.id,
    });

    res.status(200).send({ portfolios: portfolios });
  } catch (err) {
    next(err);
  }
};

export const buy: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { stock, code } = req.body;

    const portfolioService = new PortfolioService();
    const marketInstrumentService=new MarketInstrumentService()

    const marketInstrument = await MarketInstrument.findOne({
      code: code,
      status: 1,
    });
    if (!marketInstrument) {
      throw new BadRequestError("Not Found Market Instrument");
    }

    const isAvailableStock = await marketInstrumentService.isAvailable(
      marketInstrument._id,
      stock
    );
    if (!isAvailableStock) {
      throw new BadRequestError("There is not enough stock");
    }

    await portfolioService.check(req.currentUser!.id, marketInstrument._id);
    await portfolioService.buy(marketInstrument.price, stock);

    return res.status(200).send({ message: "Success" });
  } catch (err) {
    next(err);
  }
};

export const sell: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { stock, code } = req.body;

    const marketInstrument = await MarketInstrument.findOne({
      code: code,
      status: 1,
    });
    if (!marketInstrument) {
      throw new BadRequestError("Not Found Market Instrument");
    }

    const myPortfolio = await Portfolio.findOne({
      user_id:req.currentUser!.id,
      market_instrument_id: marketInstrument._id,
    });
    if (!myPortfolio) {
      throw new BadRequestError("Not Found Portfolio");
    }

    const portfolioService = new PortfolioService();
    const canBeSold = await portfolioService.canBeSold(
      myPortfolio._id,
      stock
    );
    if (!canBeSold) {
      throw new BadRequestError("There is not enough stock");
    }

    await portfolioService.check(req.currentUser!.id, marketInstrument._id);
    await portfolioService.sell(marketInstrument.price, stock);

    return res.status(200).send({ message: "Success" });
  } catch (err) {
    next(err);
  }
};
