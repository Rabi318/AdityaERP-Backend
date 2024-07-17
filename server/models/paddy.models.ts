import { model, Model, Schema, Types } from "mongoose";
import PADDY_TYPES from "../types";

const paddySchema = new Schema<PADDY_TYPES, Model<PADDY_TYPES>>(
  {
    nonPlastic: {
      type: Number,
      required: true,
      default: 0,
    },
    packet: [
      {
        type: Number,
        required: true,
      },
    ],
    paddyType: {
      type: String,
      enum: ["1009", "1001", "DERADUN", "BHULAXMI"],
      required: true,
    },
    userId: {
      type: Types.ObjectId,
      ref: "Users",
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    rate: {
      type: Number,
      required: true,
    },
    nonPlasticRate: {
      type: Number,
      required: true,
      default: 12,
    },
  },
  { timestamps: true }
);

export default model<PADDY_TYPES, Model<PADDY_TYPES>>(
  "Paddies",
  paddySchema,
  "Paddies"
);
