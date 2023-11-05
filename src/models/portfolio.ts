import mongoose from "mongoose";

interface PortfolioAttrs {
  user_id: mongoose.Types.ObjectId;
  market_instrument_id: mongoose.Types.ObjectId;
  stock: number;
  details: object;
  status: number;
}

interface PortfolioModel extends mongoose.Model<PortfolioDoc> {
  build(attrs: PortfolioAttrs): PortfolioDoc;
}

interface PortfolioDoc extends mongoose.Document {
  user_id: mongoose.Types.ObjectId;
  market_instrument_id: mongoose.Types.ObjectId;
  stock: number;
  details: object;
  status: number;
}

const portfolioSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    market_instrument_id: {
      type: mongoose.Types.ObjectId,
      ref: "MarketInstrument",
    },
    stock: {
      type: Number,
      required: true,
    },
    details: [
      {
        type: {
          type: String,
          trim: true,
          require: true,
          default: "BUY",
        },
        price: {
          type: Number,
          trim: true,
          require: true,
          default: 0,
        },
        stock: {
          type: Number,
          required: true,
        },
      },
    ],
    status: {
      type: Number,
      require: true,
      default: 1,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

portfolioSchema.statics.build = (attrs: PortfolioAttrs) => {
  return new Portfolio(attrs);
};

const Portfolio = mongoose.model<PortfolioDoc, PortfolioModel>(
  "Portfolio",
  portfolioSchema
);

export { Portfolio,PortfolioDoc };
