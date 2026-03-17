import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema(
  {
    batch: {
      type: String,
      required: true,
      unique: true,
    },
    itemName: {
      type: String,
      required: true,
      enum: [
        "Facewash",
        "Face_Serum",
        "Face_Moisturizer",
        "Sunscreen",
      ],
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
    },
    mrp: {
      type: Number,
      required: true,
    },
    basePrice: {
      type: Number,
      required: true,
    },
    gstPercentage: {
      type: Number,
      required: true,
    },
    gstAmount: {
      type: Number,
      required: true,
    }
  },
  { timestamps: true }
);

export default mongoose.models.Inventory ||
  mongoose.model("Inventory", InventorySchema);