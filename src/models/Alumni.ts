import { Schema, model, models } from "mongoose";

const AlumniSchema = new Schema(
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
    graduationYear: { type: String, required: true, trim: true },
    college: { type: String, required: true, trim: true },
    work: { type: String, required: true, trim: true },
    company: { type: String, trim: true },
  },
  { timestamps: true },
);

const Alumni = models.Alumni || model("Alumni", AlumniSchema);

export default Alumni;
