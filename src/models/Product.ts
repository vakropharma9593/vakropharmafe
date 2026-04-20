import mongoose from "mongoose";

const RatingBreakdownSchema = new mongoose.Schema(
  {
    5: { type: Number, default: 0 },
    4: { type: Number, default: 0 },
    3: { type: Number, default: 0 },
    2: { type: Number, default: 0 },
    1: { type: Number, default: 0 },
  },
  { _id: false }
);

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
    oldSlugs: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
    ratingBreakdown: {
      type: RatingBreakdownSchema,
      default: () => ({
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      }),
    },
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);