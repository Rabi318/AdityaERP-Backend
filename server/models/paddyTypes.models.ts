import { model, Model, Schema } from "mongoose";
import PADDYTYPES_TYPES from "../types";
const paddyTypeSchema = new Schema<PADDYTYPES_TYPES, Model<PADDYTYPES_TYPES>>(
  {
    name: {
      type: String,
      required: true,
      uppercase: true,
    },
  },
  { timestamps: true }
);

export default model<PADDYTYPES_TYPES, Model<PADDYTYPES_TYPES>>(
  "PaddyTypes",
  paddyTypeSchema,
  "PaddyTypes"
);
