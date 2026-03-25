import { ExpenseCategoryType, PaymentModeType } from "@/lib/utils";
import mongoose from "mongoose";

/**
 * Expense Schema
 */
const ExpenseSchema = new mongoose.Schema(
  {
    voucher: {
        type: String,
        required: true,
    },
    paidTo: {
        type: String,
        required: true,
    },
    expenseCategory: {
        type: String,
        enum: Object.values(ExpenseCategoryType),
        required: true,
    },
    purpose: {
        type: String,
        required: true,
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: false,
    }, 
    amountPaid: {
        type: Number,
        required: true,
    },
    paidBy: {
        type: String,
        required: true,
    },
    paymentDate: {
        type: Date,
        required: true,
    },
    paymentMode: {
        type: String,
        enum: Object.values(PaymentModeType)
    },
    authorizedByDirector: {
        type: Boolean,
        required: true,
    },
    isSettled: {
        type: Boolean,
        required: true,
    },
    settlementDate: {
        type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Expense ||
  mongoose.model("Expense", ExpenseSchema);