import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import Inventory from "@/models/Inventory";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();

    // POST: Create inventory
    if (req.method === "POST") {
      const {
        batch,
        itemName,
        totalCount,
        remainingCount,
        mfgDate,
        receivedDate,
        expiryDate,
        mrp,
        gstPercentage,
      } = req.body;

      const gst = parseFloat(gstPercentage);
      const mrpAmount = parseFloat(mrp);
      const basePrice: number = mrpAmount / (1 + gst / 100);
      const gstAmount = mrpAmount - basePrice;
      const mrpToSave = Number(mrpAmount.toFixed(2));
      const basePriceToSave = Number(basePrice.toFixed(2));
      const gstAmountToSave = Number(gstAmount.toFixed(2));

      const inventory = await Inventory.create({
        batch,
        itemName,
        totalCount,
        remainingCount,
        mfgDate,
        receivedDate,
        expiryDate,
        mrp: mrpToSave,
        basePrice: basePriceToSave,
        gstPercentage,
        gstAmount: gstAmountToSave
      });

      return res.status(201).json({
        success: true,
        data: inventory,
      });
    }

    // GET: Fetch inventory list
    if (req.method === "GET") {
      const inventory = await Inventory.find().sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        data: inventory,
      });
    }

    res.status(405).json({ message: "Method not allowed" });

  } catch (error) {
    console.error("INVENTORY API ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}