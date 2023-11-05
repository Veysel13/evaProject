import { Request, Response, NextFunction, RequestHandler } from "express";
import { User } from "../../../models/user";
import { MarketInstrument } from "../../../models/market-instrument";
import { v4 as uuidv4 } from "uuid";
import { PortfolioService } from "../../../services/portfolio";

export const exampleData: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const marketInstrument = MarketInstrument.build({
      name: "IT Company",
      symbol: "ITC",
      stock: 5000,
      price: 45.5,
      code: uuidv4(),
      status: 1,
    });
    await marketInstrument.save();

    const portfolioService = new PortfolioService();

    for (var i = 1; i <= 5; i++) {
      const user = User.build({
        name: "Name " + i,
        surname: "Name " + i,
        email: "email" + i + "@gmail.com",
        password: "123456",
      });
      await user.save().then(async (response) => {
        await portfolioService.check(response._id, marketInstrument._id);
        await portfolioService.buy(marketInstrument.price, i + 1);
        await portfolioService.sell(marketInstrument.price, i);
      });
    }

    res.status(201).send({});
  } catch (err) {
    next(err);
  }
};
