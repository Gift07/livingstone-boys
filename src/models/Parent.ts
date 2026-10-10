import { Schema, model, models } from "mongoose";

const ParentSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

const Parent = models.Parent || model("Parent", ParentSchema);

export default Parent;
