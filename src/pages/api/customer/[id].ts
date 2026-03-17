import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import Customer from "@/models/Customer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();

    if (req.method === "PATCH") {
      const { id } = req.query;
      const { name, phone, address, type } = req.body;

      const order = await Customer.findByIdAndUpdate(
        id,
        { name, phone, address, type },
        { new: true, runValidators: true }
      );

      return res.status(200).json({
        success: true,
        data: order
      });
    }

    if (req.method === "GET") {
      const { id } = req.query;

      const customer = await Customer.findOne({ phone: id })

      return res.status(200).json({
        success: true,
        data: customer
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