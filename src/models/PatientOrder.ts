import { OrderStatusType, PaymentModeType, PaymentStatusType } from "@/lib/utils";
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
  accountTotalPrice: {
    type: Number,
    required: true,
  },
  discountPercentage: {
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
      index: true, // ✅ helps filtering
    },

    date: {
      type: Date,
      required: true,
      index: true, // ✅ helps sorting
    },

    status: {
      type: String,
      enum: Object.values(OrderStatusType),
      default: OrderStatusType.PREPARING,
      index: true, // ✅ useful if filtering by status later
    },
  
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatusType),
      default: PaymentStatusType.PAYMENT_PENDING,
      index: true, // ✅ useful if filtering by status later
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

    totalAccountAmount: {
      type: Number,
      required: true,
    },

    paymentDate: {
      type: Date,
    },

    paymentType: {
        type: String,
        enum: Object.values(PaymentModeType),
    },

    products: {
      type: [ProductSchema],
      required: true,
    },
  },
  { timestamps: true }
);


// 🔥 MOST IMPORTANT (for your API)
PatientOrderSchema.index({ customerId: 1, date: -1 });

// 🔥 Optional (future-proofing)
PatientOrderSchema.index({ date: -1 }); // global sorting

export default mongoose.models.PatientOrder ||
  mongoose.model("PatientOrder", PatientOrderSchema);