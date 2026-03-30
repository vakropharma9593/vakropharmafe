import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import "@/models/Customer";
import "@/models/Order";
import "@/models/Product";
import ReturnRefund from "@/models/ReturnRefund";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();

    // CREATE RETURNREFUND
    if (req.method === "POST") {
      const { orderId, date, status, amountPaidBack  } = req.body;
      
      // Create ReturnRefund
      const returnRefund = await ReturnRefund.create({
        orderId,
        date,
        status,
        amountPaidBack
      });

      return res.status(201).json({
        success: true,
        data: returnRefund,
      });
    }

    // GET RETURNREFUND
    if (req.method === "GET") {
      const returnRefunds = await ReturnRefund.find()
                            .populate({
                                path: "orderId",
                                select: "products",
                                populate: {
                                    path: "products.productId",
                                    select: "name",
                                },
                            })
                            .lean();

      return res.status(200).json({
        success: true,
        data: returnRefunds
      });
    }

    res.status(405).json({ message: "Method Not Allowed" });

  } catch (error) {
    console.error("RETURNREFUND API ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
}