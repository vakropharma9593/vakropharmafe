import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    reviewerName: {
      type: String,
      required: true,
    },
    skinType: {
      type: String,
    },
    skinConcern: {
      type: String,
    },
    rating: {
        type: Number,
        required: true,
    },
    review: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
    },
    email: {
        type: String,
    },
    isVerifiedUser: {
        type: Boolean,
        default: false
    }
  },
  { timestamps: true }
);

export default mongoose.models.Review ||
  mongoose.model("Review", ReviewSchema);