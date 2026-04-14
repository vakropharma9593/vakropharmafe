import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import CreditInventory from "@/models/CreditInventory";
import "@/models/Customer";
import "@/models/Inventory";
import "@/models/Product";
import Customer from "@/models/Customer";

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
        const newProduct = { ...product, totalQuantity: parseInt(product.totalQuantity), remainingQuantity: parseInt(product.totalQuantity), freeQuantity: parseInt(product.freeQuantity), remainingFreeQuantity: parseInt(product.freeQuantity) };
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
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = (req.query.search as string) || "";

      const skip = (page - 1) * limit;

      // 🔍 Step 1: Find matching customers
      let customerFilter: Record<string, unknown> = {};

      if (search) {
        const searchRegex = new RegExp(`^${search}`, "i");

        const customers = await Customer.find({
          $or: [
            { name: searchRegex },
            { phone: searchRegex },
          ],
        }).select("_id");

        const customerIds = customers.map((c) => c._id);

        // If no customers found → return empty directly
        if (customerIds.length === 0) {
          return res.status(200).json({
            success: true,
            data: [],
            pagination: {
              total: 0,
              page,
              limit,
              totalPages: 0,
            },
          });
        }

        customerFilter = { customerId: { $in: customerIds } };
      }

      // ✅ Step 2: Total count
      const total = await CreditInventory.countDocuments(customerFilter);

      // ✅ Step 3: Fetch paginated data
      const creditInventory = await CreditInventory.find(customerFilter)
        .populate("customerId", "name phone type")
        .populate("products.productId", "name")
        .populate("products.batchId", "batch")
        .sort({ dateOfInventory: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      // ✅ Step 4: Transform response
      const creditInventoryToSend = creditInventory.map((item) => ({
        _id: item?._id,

        products: item?.products?.map((each: { productId: { _id: string, name: string }, batchId: { _id: string, batch: string }, totalQuantity: number, remainingQuantity: number, freeQuantity: number, remainingFreeQuantity: number  }) => ({
          productId: each.productId?._id,
          productName: each.productId?.name,
          batchId: each.batchId?._id,
          batch: each.batchId?.batch,
          totalQuantity: each.totalQuantity,
          remainingQuantity: each.remainingQuantity,
          freeQuantity: each.freeQuantity,
          remainingFreeQuantity: each.remainingFreeQuantity,
        })),

        customerId: item?.customerId?._id,
        customerName: item?.customerId?.name,
        customerPhone: item?.customerId?.phone,
        customerType: item?.customerId?.type,
        dateOfInventory: item?.dateOfInventory,
      }));

      return res.status(200).json({
        success: true,
        data: creditInventoryToSend,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
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