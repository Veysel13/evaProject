import mongoose from "mongoose";

interface TransactionAttrs {
  user_id: mongoose.Types.ObjectId;
  market_instrument_id: mongoose.Types.ObjectId;
  type: string;
  price: number;
  stock: number;
}

interface TransactionModel extends mongoose.Model<TransactionDoc> {
  build(attrs: TransactionAttrs): TransactionDoc;
}

interface TransactionDoc extends mongoose.Document {
  user_id: mongoose.Types.ObjectId;
  market_instrument_id: mongoose.Types.ObjectId;
  type: string;
  price: number;
  quantity: number;
}

const transactionSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    market_instrument_id: {
      type: mongoose.Types.ObjectId,
      ref: "MarketInstrument",
    },
    type: {
      type: String,
      trim: true,
      require: true,
      default: "BUY",
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

transactionSchema.statics.build = (attrs: TransactionAttrs) => {
  return new Transaction(attrs);
};

const Transaction = mongoose.model<TransactionDoc, TransactionModel>(
  "Transaction",
  transactionSchema
);

export { Transaction };
