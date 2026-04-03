import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    mrp: {
      type: Number,
      required: true,
    },
    costPrice: {
      type: Number,
      required: true,
    },
    gstPercentageOnCostPrice: {
      type: Number,
      required: true,
    },
    gstPercentage: {
      type: Number,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    }
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);