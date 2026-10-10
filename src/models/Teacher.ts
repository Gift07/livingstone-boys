import { Schema, model, models } from "mongoose";

const TeacherSchema = new Schema(
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
    subject: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

const Teacher = models.Teacher || model("Teacher", TeacherSchema);

export default Teacher;
