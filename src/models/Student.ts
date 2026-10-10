import { Schema, model, models } from "mongoose";

const StudentSchema = new Schema(
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
    grade: { type: String, required: true, trim: true },
    gender: { type: String, enum: ["Male"], default: "Male", trim: true },
    dateOfBirth: { type: Date },
  },
  { timestamps: true },
);

const Student = models.Student || model("Student", StudentSchema);

export default Student;
