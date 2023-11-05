import { ObjectId } from "mongoose";
import { Portfolio,PortfolioDoc } from "../models/portfolio";
import { TransactionService } from "../services/transaction";
import { InterfacePortfolio } from "./interface/interface-portfolio";

interface PortfolioPayload {
  id: string;
  user_id: string;
  market_instrument_id: string;
  stock: number;
  details:object
}

export class PortfolioService implements InterfacePortfolio {
  private userPortfolio?: PortfolioPayload;

  constructor() {}

  async gets(query: Object) : Promise<PortfolioDoc[]> {
    return await Portfolio.find(query);
  }

  async get(query: Object)  {
    const portfolio=await Portfolio.find(query);
    return portfolio;
  }

  async check(userId: string, marketInstrumentId: string) {
    let portfolio = await Portfolio.findOne({
      user_id: userId,
      market_instrument_id: marketInstrumentId,
    });
    if (!portfolio) {
      let newPortfolio = Portfolio.build({
        user_id: Object(userId),
        market_instrument_id: Object(marketInstrumentId),
        stock: 0,
        details: [],
        status: 1,
      });

      await newPortfolio.save();

      portfolio = await Portfolio.findOne({
        user_id: userId,
        market_instrument_id: marketInstrumentId,
      });
    }

    this.userPortfolio = {
      id: Object(portfolio!._id),
      user_id: Object(portfolio!.user_id),
      market_instrument_id: Object(portfolio!.market_instrument_id),
      stock: portfolio!.stock,
      details:portfolio!.details
    };
  }

  async buy(price: number, stock: number) {
    await Portfolio.updateOne(
      { _id: this.userPortfolio!.id },
      {
        stock: this.userPortfolio!.stock + stock,
        $push: {
          details: {
            price: price,
            stock: stock,
            type: "BUY",
          },
        },
      }
    );

    const transactionService = new TransactionService();
    transactionService.store(
      this.userPortfolio!.user_id,
      this.userPortfolio!.market_instrument_id,
      "BUY",
      price,
      stock
    );

    this.userPortfolio!.stock+= stock;
  }

  async sell(price: number, stock: number) {
    await Portfolio.updateOne(
      { _id: this.userPortfolio!.id },
      {
        stock: this.userPortfolio!.stock - stock,
        $push: {
          details: {
            price: price,
            stock: stock,
            type: "SELL",
          },
        },
      }
    );

    const transactionService = new TransactionService();
    transactionService.store(
      this.userPortfolio!.user_id,
      this.userPortfolio!.market_instrument_id,
      "SELL",
      price,
      stock
    );

    this.userPortfolio!.stock-= stock;
  }

  async canBeSold(id: string, stock: number): Promise<boolean> {
    const portfolio = await Portfolio.findOne({ _id: id });

    if (!portfolio || portfolio.stock < stock) {
      return false;
    }

    return true;
  }
}
