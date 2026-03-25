import { OrderStatusType, PaymentModeType } from "@/lib/utils";
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
const PatientOrderSchema = new mongoose.Schema(
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
      enum: Object.values(OrderStatusType),
      default: OrderStatusType.PAYMENT_PENDING,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    paymentType: {
        type: String,
        enum: Object.values(PaymentModeType),
        required: true
    },

    products: {
      type: [ProductSchema],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.PatientOrder ||
  mongoose.model("PatientOrder", PatientOrderSchema);