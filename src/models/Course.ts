import { Schema, model, models } from "mongoose";

const CourseSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, trim: true, uppercase: true },
    description: { type: String, trim: true },
    credits: { type: Number, required: true, min: 1, default: 3 },
    teacher: { type: Schema.Types.ObjectId, ref: "Teacher" },
  },
  { timestamps: true },
);

const Course = models.Course || model("Course", CourseSchema);

export default Course;
