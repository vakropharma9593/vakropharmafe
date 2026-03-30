import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import Inventory from "@/models/Inventory"
import "@/models/Product";
import { ObjectId } from "mongoose";

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
        productId,
        totalCount,
        mfgDate,
        receivedDate,
        expiryDate,
      } = req.body;

      const inventory = await Inventory.create({
        batch,
        productId,
        totalCount,
        remainingCount: totalCount,
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
      const inventory = await Inventory.find()
      .populate("productId", "name costPrice mrp gstPercentage")
      .sort({ createdAt: -1 });

      const inventoryToSend: {
        _id: ObjectId,
        productId: ObjectId,
        batch: string,
        totalCount: number,
        remainingCount: number,
        receivedDate: Date,
        mfgDate: Date,
        expiryDate: Date,
        productName: string,
        costPrice: number,
        mrp: number,
        gstPercentage: number
      }[] = [];
      inventory.forEach((item) => {

        const newInventory = {
          _id: item?._id,
          batch: item?.batch,
          productId: item?.productId?._id,
          totalCount: item?.totalCount,
          remainingCount: item?.remainingCount,
          mfgDate: item?.mfgDate,
          receivedDate: item?.receivedDate,
          expiryDate: item?.expiryDate,
          productName: item?.productId?.name,
          costPrice: item?.productId?.costPrice,
          mrp: item?.productId?.mrp,
          gstPercentage: item?.productId?.gstPercentage
        }
        inventoryToSend.push(newInventory);
      })

      return res.status(200).json({
        success: true,
        data: inventoryToSend,
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