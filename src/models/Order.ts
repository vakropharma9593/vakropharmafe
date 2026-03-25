import mongoose from "mongoose";

/**
 * Product Schema
 */
const ProductSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  batchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Inventory",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  sellingPrice: {
    type: Number,
    required: true,
  },
  profit: {
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

    totalAmount: {
      type: Number,
      required: true,
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