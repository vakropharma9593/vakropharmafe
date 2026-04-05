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

    // =========================
    // ✅ POST: Create NEW record always
    // =========================
    if (req.method === "POST") {
      const {
        products,
        customerId,
        dateOfInventory,
      } = req.body;

      // 🔴 Basic validation
      if (
        !customerId ||
        !dateOfInventory
      ) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }

      const parsedDate = new Date(dateOfInventory);

      const finalProducts = [];
      
      for (const product of products) {
        const newProduct = { ...product, totalUnit: parseInt(product.totalUnit), remainingUnit: parseInt(product.totalUnit) };
        finalProducts.push(newProduct);
      }

      const creditInventory = await CreditInventory.create({
        products: finalProducts,
        customerId,
        dateOfInventory: parsedDate,
      });

      return res.status(201).json({
        success: true,
        data: creditInventory,
      });
    }

    // =========================
    // ✅ GET: Fetch with optional filters
    // =========================
    if (req.method === "GET") {
      // const { fromDate, toDate, customerId } = req.query;

      // const filter: Record<string, unknown> = {};

      // // 🔹 Filter by date range
      // if (fromDate && toDate) {
      //   filter.dateOfInventory = {
      //     $gte: new Date(fromDate as string),
      //     $lte: new Date(toDate as string),
      //   };
      // }

      // // 🔹 Filter by customer
      // if (customerId) {
      //   filter.customerId = customerId;
      // }

      const creditInventory = await CreditInventory.find()
        .populate("customerId", "name phone")
        .populate("products.productId", "name")
        .populate("products.batchId", "batch")
        .sort({ dateOfInventory: -1, createdAt: -1 });

      const creditInventoryToSend: {
        _id: ObjectId;
        products: {
          productId: ObjectId;
          productName: string;
          batchId: ObjectId;
          batch: string;
          totalUnit: number;
          remainingUnit: number;
        }[];
        customerId: ObjectId;
        customerName: string;
        customerPhone: string;
        dateOfInventory: Date;
      }[] = [];

      creditInventory.forEach((item) => {
        creditInventoryToSend.push({
          _id: item?._id,
          products: item?.products?.map((each: { productId: { _id: ObjectId, name: string }, batchId: { _id: ObjectId, batch: string }, totalUnit: number, remainingUnit: number }) => {
            return {
              productId: each.productId._id,
              productName: each.productId.name,
              batchId: each.batchId._id,
              batch: each.batchId.batch,
              totalUnit: each.totalUnit,
              remainingUnit: each.remainingUnit,
            }
          }),
          customerId: item?.customerId?._id,
          customerName: item?.customerId?.name,
          customerPhone: item?.customerId?.phone,
          dateOfInventory: item?.dateOfInventory,
        });
      });

      return res.status(200).json({
        success: true,
        data: creditInventoryToSend,
      });
    }

    return res.status(405).json({ message: "Method not allowed" });

  } catch (error) {
    console.error("CREDIT-INVENTORY API ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}