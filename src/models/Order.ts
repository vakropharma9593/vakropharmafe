import mongoose from "mongoose";

/**
 * Product Enum
 */
export enum ProductName {
  FACEWASH = "Facewash",
  FACE_SERUM = "Face_Serum",
  FACE_MOISTURIZER = "Face_Moisturizer",
  SUNSCREEN = "Sunscreen",
}

/**
 * Product Schema
 */
const ProductSchema = new mongoose.Schema({
  productName: {
    type: String,
    enum: Object.values(ProductName),
    required: true,
  },
  sellingPrice: {
    type: Number,
    required: true,
  },
  batch: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  basePrice: {
    type: Number,
    required: true,
  }
});

/**
 * Order Schema
 */
const OrderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Payment_Pending",
        "Payment_Done",
        "Preparing",
        "Dispatched",
        "Delivered",
      ],
      default: "Payment_Pending",
    },

    products: {
      type: [ProductSchema],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order ||
  mongoose.model("Order", OrderSchema);