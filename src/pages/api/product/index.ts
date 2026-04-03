import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();

    // POST: Create Product
    if (req.method === "POST") {
      const {
        name,
        mrp,
        costPrice,
        gstPercentage,
        gstPercentageOnCostPrice,
        isActive
      } = req.body;

      const slug = name.toLowerCase().replace(/\s+/g, "-");

      const product = await Product.create({
        name,
        mrp: Number(mrp.toFixed(2)),
        costPrice,
        gstPercentageOnCostPrice,
        gstPercentage,
        slug,
        isActive
      });

      return res.status(201).json({
        success: true,
        data: product,
      });
    }

    // GET: Fetch Product list
    if (req.method === "GET") {
      const products = await Product.find().sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        data: products,
      });
    }

    res.status(405).json({ message: "Method not allowed" });

  } catch (error) {
    console.error("PRODUCT API ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}