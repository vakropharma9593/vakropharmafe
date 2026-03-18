import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import CreditInventory from "@/models/CreditInventory";

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
        customerId
      } = req.body;

      const creditInventory = await CreditInventory.create({
        batch,
        itemName,
        totalCount,
        remainingCount,
        customerId,
      });

      const populatedInventory = await creditInventory.populate(
        "customerId",
        "name phone"
      );

      return res.status(201).json({
        success: true,
        data: populatedInventory,
      });
    }

    // GET: Fetch inventory list
    if (req.method === "GET") {
      const creditInventory = await CreditInventory.find()
        .populate("customerId", "name phone")
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        data: creditInventory,
      });
    }

    res.status(405).json({ message: "Method not allowed" });

  } catch (error) {
    console.error("CREDIT-INVENTORY API ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}