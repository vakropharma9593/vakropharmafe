import mongoose from "mongoose";

/**
 * Product Enum
 */
export enum PurposeType {
  PRODUCT = "Product",
  SALARY = "Salary",
  MARKETING = "Marketing",
  RENT_ELECTRICITY = "Rent & Electricity",
  OTHER = "Other"
}

export enum PaymentModeType {
    CASH = "Cash",
    UPI = "UPI",
    BANK_TRANSFER = "Bank Transfer",
    CHEQUE = "Cheque",
}

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
    purpose: {
        type: String,
        enum: Object.values(PurposeType),
        required: true,
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
        type: String,
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