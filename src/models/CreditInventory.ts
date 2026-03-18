import mongoose from "mongoose";

const CreditInventorySchema = new mongoose.Schema(
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