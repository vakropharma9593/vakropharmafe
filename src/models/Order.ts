import { OrderStatusType, OrderType } from "@/lib/utils";
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

    paymentDate: {
      type: Date,
    },

    status: {
      type: String,
      enum: Object.values(OrderStatusType),
      default: OrderStatusType.PAYMENT_PENDING,
    },

    orderType: {
      type: String,
      enum: Object.values(OrderType),
      default: OrderType.DIRECT_CUSTOMER,
    },

    deliveryService: {
      type: String,
    },

    deliveryTrackNumber: {
      type: String,
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