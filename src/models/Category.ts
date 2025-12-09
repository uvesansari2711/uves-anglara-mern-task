import mongoose, { Document, Schema, Types } from "mongoose";

export type CategoryStatus = "active" | "inactive";

export interface ICategory extends Document {
  name: string;
  status: CategoryStatus;
  parent?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      index: true,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
      index: true,
    },
  },
  { timestamps: true }
);

// Index for efficient tree queries
categorySchema.index({ parent: 1, name: 1 }, { unique: false });

export const Category = mongoose.model<ICategory>("Category", categorySchema);
