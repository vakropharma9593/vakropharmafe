import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import Customer from "@/models/Customer";

type MongoError = {
  code?: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();

    // CREATE CUSTOMER
    if (req.method === "POST") {
      const { name, phone, address, type } = req.body;

      if (!name || !phone || !address || !type) {
        return res.status(400).json({
          success: false,
          message: "All fields are required"
        });
      }

      const customer = await Customer.create({
        name,
        phone,
        address,
        type
      });

      return res.status(201).json({
        success: true,
        data: customer
      });
    }

    // GET ALL CUSTOMERS (with pagination)
    if (req.method === "GET") {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = (req.query.search as string) || "";
      const type = (req.query.type as string) || "";

      const skip = (page - 1) * limit;

      // 🔍 Build query
      const query: Record<string, unknown> = {};

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
        ];
      }

      if (type) {
        query.type = type;
      }

      // Count
      const total = await Customer.countDocuments(query);

      // Data
      const customers = await Customer.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      return res.status(200).json({
        success: true,
        data: customers,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    }

    res.status(405).json({ message: "Method Not Allowed" });

  } catch (error: unknown) {
    console.error("CUSTOMER API ERROR:", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as MongoError).code === 11000
    ) {
      return res.status(409).json({
        success: false,
        message: "Customer with this phone number already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
}