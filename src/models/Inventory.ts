import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema(
  {
    batch: {
      type: String,
      required: true,
      unique: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    totalCount: {
      type: Number,
      required: true,
    },
    remainingCount: {
      type: Number,
      required: true,
    },
    mfgDate: {
      type: Date,
      required: true,
    },
    receivedDate: {
      type: Date,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    }
  },
  { timestamps: true }
);

InventorySchema.index({ createdAt: -1 });

export default mongoose.models.Inventory ||
  mongoose.model("Inventory", InventorySchema);