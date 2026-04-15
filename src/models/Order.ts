import { OrderStatusType, OrderType, PaymentStatusType } from "@/lib/utils";
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
  freeQuantity: {
    type: Number,
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
      index: true, // ✅ helps filtering
    },

    date: {
      type: Date,
      required: true,
      index: true, // ✅ helps sorting
    },

    paymentDate: {
      type: Date,
    },

    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatusType),
    },

    status: {
      type: String,
      enum: Object.values(OrderStatusType),
      default: OrderStatusType.PREPARING,
      index: true, // ✅ useful if filtering by status later
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


// 🔥 MOST IMPORTANT (for your API)
OrderSchema.index({ customerId: 1, date: -1 });

// 🔥 Optional (future-proofing)
OrderSchema.index({ date: -1 }); // global sorting
OrderSchema.index({ status: 1, date: -1 }); // status + sorting


export default mongoose.models.Order ||
  mongoose.model("Order", OrderSchema);