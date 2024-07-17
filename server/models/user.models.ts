import { model, Model, Schema } from "mongoose";
import USER_TYPE from "../types";
import bcrypt from "bcrypt";

const UserSchema = new Schema<USER_TYPE, Model<USER_TYPE>>(
  {
    name: {
      type: String,
      required: true,
      uppercase: true,
    },

    phone: {
      type: Number,
      required: true,
      unique: true,
    },
    gender: {
      type: String,
      enum: ["MALE", "FEMALE"],
      default: "MALE",
    },
    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER",
    },
    password: {
      type: String,
    },
    village: {
      type: String,
      required: true,
      uppercase: true,
    },
    email: {
      type: String,
      lowercase: true,
      default: null,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const hashedPassword = await bcrypt.hash(this.password as string, 10);
  this.password = hashedPassword;
  next();
});

UserSchema.methods.isPasswordMatched = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

export default model<USER_TYPE, Model<USER_TYPE>>("Users", UserSchema, "Users");
