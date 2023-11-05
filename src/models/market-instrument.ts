import mongoose, { Decimal128 } from "mongoose";

interface MarketInstrumentAttrs {
  name: string;
  symbol: string;
  code: string;
  stock: number;
  price: number;
  status?: number;
}

interface MarketInstrumentModel extends mongoose.Model<MarketInstrumentDoc> {
  build(attrs: MarketInstrumentAttrs): MarketInstrumentDoc;
}

interface MarketInstrumentDoc extends mongoose.Document {
  name: string;
  symbol: string;
  code: string;
  stock: number;
  price: number;
  status: number;
}

const marketInstrumentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    symbol: {
      type: String,
      minlength: 3,
      maxlength: 3,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      trim: true,
      require: true,
      default: 0,
    },
    status: {
      type: Number,
      require: true,
      enum: [0, 1],
      default: 0,
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

marketInstrumentSchema.statics.build = (attrs: MarketInstrumentAttrs) => {
  return new MarketInstrument(attrs);
};

const MarketInstrument = mongoose.model<
  MarketInstrumentDoc,
  MarketInstrumentModel
>("MarketInstrument", marketInstrumentSchema);

export { MarketInstrument, MarketInstrumentDoc };
