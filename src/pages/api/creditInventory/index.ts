import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import CreditInventory from "@/models/CreditInventory";
import "@/models/Customer"; 
import "@/models/Inventory";
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
        batchId,
        productId,
        totalCount,
        customerId
      } = req.body;

      const existing = await CreditInventory.findOne({
                        batchId,
                        productId,
                        customerId,
                      });

      let creditInventory;

      if (existing) {
        existing.totalCount = existing.totalCount + parseInt(totalCount);
        existing.remainingCount = existing.remainingCount + parseInt(totalCount);
        creditInventory = await existing.save();
      } else {
        creditInventory = await CreditInventory.create({
          batchId,
          productId,
          totalCount,
          remainingCount: totalCount,
          customerId,
        });
      }

      // const creditInventory = await CreditInventory.create({
      //   batchId,
      //   productId,
      //   totalCount,
      //   remainingCount: totalCount,
      //   customerId,
      // });

      // const populatedInventory = await creditInventory.populate(
      //   "customerId",
      //   "name phone"
      // );

      return res.status(201).json({
        success: true,
        data: creditInventory,
      });
    }

    // GET: Fetch inventory list
    if (req.method === "GET") {
      const creditInventory = await CreditInventory.find()
        .populate("customerId", "name phone")
        .populate("productId", "name")
        .populate("batchId", "batch")
        .sort({ createdAt: -1 });

      const creditInventoryToSend: {
        _id: ObjectId,
        productId: ObjectId,
        productName: string,
        batchId: ObjectId,
        batch: string,
        customerId: ObjectId,
        customerName: string,
        customerPhone: string,
        totalCount: number,
        remainingCount: number,
      }[] = [];
      creditInventory.forEach((item) => {
        const newCInventory = {
          _id: item?._id,
          productId: item?.productId?._id,
          productName: item?.productId?.name,
          batchId: item?.batchId?._id,
          batch: item?.batchId?.batch,
          customerId: item?.customerId?._id,
          customerName: item?.customerId?.name,
          customerPhone: item?.customerId?.phone,
          totalCount: item?.totalCount,
          remainingCount: item?.remainingCount,
        }
        creditInventoryToSend.push(newCInventory);
      }) 

      return res.status(200).json({
        success: true,
        data: creditInventoryToSend,
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