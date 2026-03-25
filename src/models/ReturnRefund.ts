import mongoose from "mongoose";

/**
 * Return Refund Status Enum
 */
export enum ReturnRefundStatusType {
  RETURN_INITIATED = "Return Initiated",
  PACKAGE_PICKED = "Package Picked ",
  PACKAGE_RECEIVED = "Package Received",
  REFUND_INITIATED = "Refund Initiated",
  REFUND_COMPLETED = "Refund Completed"
}

/**
 * Return Refunds Schema
 */
const ReturnRefundSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    amountPaidBack: {
        type: Number,
        required: true,
    },
    status: {
      type: String,
      enum: Object.values(ReturnRefundStatusType),
      default: ReturnRefundStatusType.PACKAGE_PICKED,
    }
  },
  { timestamps: true }
);

export default mongoose.models.ReturnRefund ||
  mongoose.model("ReturnRefund", ReturnRefundSchema);