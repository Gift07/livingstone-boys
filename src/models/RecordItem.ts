import { Schema, model, models } from "mongoose";

const RecordItemSchema = new Schema(
  {
    module: { type: String, required: true, trim: true, index: true },
    values: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

const RecordItem = models.RecordItem || model("RecordItem", RecordItemSchema);

export default RecordItem;
