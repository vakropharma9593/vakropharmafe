import { CustomerType } from "@/lib/utils";
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
    gst: {
      type: String,
    },
    type: {
      type: String,
      enum: Object.values(CustomerType),
      default: CustomerType.INDIVIDUAL,
      index: true, 
    }
  },
  { timestamps: true }
);

export default mongoose.models.Customer ||
  mongoose.model("Customer", CustomerSchema);