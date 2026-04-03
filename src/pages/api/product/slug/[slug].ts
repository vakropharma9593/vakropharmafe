import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();

    if (req.method === "GET") {

      const { slug } = req.query;
      console.info("caleed clsu", slug)

      if (!slug) {
        return res.status(400).json({
          success: false,
          message: "Slug is required",
        });
      }

      const product = await Product.findOne({
        slug,
      });

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

    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}