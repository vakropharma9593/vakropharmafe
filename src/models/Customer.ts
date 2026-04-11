import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    address: {
      type: String,
    },
    type: {
      type: String,
      enum: ["Individual", "Whole_Sale", "Retail", "Doctor"],
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.models.Customer ||
  mongoose.model("Customer", CustomerSchema);