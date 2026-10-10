import { Schema, model, models } from "mongoose";

const SubjectSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, trim: true, uppercase: true },
    grade: { type: String, required: true, trim: true },
    credits: { type: Number, required: true, min: 1, default: 3 },
  },
  { timestamps: true },
);

const Subject = models.Subject || model("Subject", SubjectSchema);

export default Subject;
