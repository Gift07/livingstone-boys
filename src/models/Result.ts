import { Schema, model, models } from "mongoose";

const ResultSchema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    subject: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    examName: { type: String, required: true, trim: true },
    marks: { type: Number, required: true, min: 0 },
    maxMarks: { type: Number, required: true, min: 1, default: 100 },
    term: { type: String, trim: true, default: "Term 1" },
  },
  { timestamps: true },
);

const Result = models.Result || model("Result", ResultSchema);

export default Result;
