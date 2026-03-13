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
      } = req.body;

      const inventory = await Inventory.create({
        batch,
        itemName,
        totalCount,
        remainingCount,
        mfgDate,
        receivedDate,
        expiryDate,
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