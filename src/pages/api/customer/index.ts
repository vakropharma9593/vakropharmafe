import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import Customer from "@/models/Customer";

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

    // GET ALL CUSTOMERS
    if (req.method === "GET") {
      const customers = await Customer.find().sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        data: customers
      });
    }

    res.status(405).json({ message: "Method Not Allowed" });

  } catch (error) {
    console.error("CUSTOMER API ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
}