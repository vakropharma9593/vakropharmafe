import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();

    if (req.method === "PATCH") {
      const { id } = req.query;
      const { isActive } = req.body;

      const existing = await Product.findById(id);
      if (!existing) {
          return res.status(404).json({
          success: false,
          message: "Product not found",
          });
      }

      existing.isActive = isActive;

      const newProduct = await existing.save();

      return res.status(200).json({
        success: true,
        data: newProduct
      });
    }

    if (req.method === "GET") {
      const { id } = req.query;

      const product = await Product.findById(id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: product,
      });
    }

    res.status(405).json({ message: "Method Not Allowed" });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
}