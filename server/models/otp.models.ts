import { model, Model, Schema } from "mongoose";
import OTP_TYPES from "../types";
const otpSchema = new Schema<OTP_TYPES, Model<OTP_TYPES>>(
  {
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    expireAt: {
      type: Date,
      required: true,
    },
    otp: {
      type: String,
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

export default model<OTP_TYPES, Model<OTP_TYPES>>("OTP", otpSchema, "OTP");
