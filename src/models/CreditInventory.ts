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
  totalQuantity: {
    type: Number,
    required: true,
    min: 0,
  },
  freeQuantity: {
    type: Number,
  },
  remainingFreeQuantity: {
    type: Number,
  },
  remainingQuantity: {
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
      index: true, // ✅ helps sorting
    },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true, // ✅ helps filtering
    },
  },
  { timestamps: true }
);


// 🔥 MOST IMPORTANT (for your API)
CreditInventorySchema.index({ customerId: 1, dateOfInventory: -1 });

// 🔥 Optional (for global sorting)
CreditInventorySchema.index({ dateOfInventory: -1, createdAt: -1 });


export default mongoose.models.CreditInventory ||
  mongoose.model("CreditInventory", CreditInventorySchema);