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
  batchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Inventory",
    required: true,
  },
  totalUnit: {
    type: Number,
    required: true,
    min: 0,
  },
  remainingUnit: {
    type: Number,
    required: true,
    min: 0,
  }
});

const CreditInventorySchema = new mongoose.Schema(
  {
    products: {
      type: [ProductSchema],
      required: true,
    },
    dateOfInventory: {
      type: Date,
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.CreditInventory ||
  mongoose.model("CreditInventory", CreditInventorySchema);