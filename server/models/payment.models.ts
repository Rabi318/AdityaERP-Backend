import { model, Model, Schema } from "mongoose";
import PAYMENT_TYPES from "../types";
const paymentSchema = new Schema<PAYMENT_TYPES, Model<PAYMENT_TYPES>>(
  {
    amount: {
      type: Number,
      required: true,
    },
    paymentType: {
      type: String,
      enum: ["ADVANCE", "PAID"],
      required: true,
    },
    paymentMode: {
      type: String,
      enum: ["ONLINE", "CASH"],
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  },
  { timestamps: true }
);

export default model<PAYMENT_TYPES, Model<PAYMENT_TYPES>>(
  "Payments",
  paymentSchema,
  "Payments"
);
