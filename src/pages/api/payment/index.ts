import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import Payment from "@/models/Payment";

import "@/models/Order";
import "@/models/Customer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();

    if (req.method === "GET") {
      const payments = await Payment.find()
        .populate({
          path: "orderId",
          select: "products customerId date",
          populate: [
            {
              path: "customerId",
              select: "phone",
            },
            {
              path: "products.productId",
              select: "name",
            },
          ],
        })
        .sort({ createdAt: -1 });

      // ✅ Format response cleanly
      const result = payments.map((p: { totalAmount: number, _id: string, paymentType: string, orderId: { customerId: { phone:  number}, products: {productId: {name: string}, sellingPrice: number, quantity: number}[], date: string } }) => {
        return {
          totalAmount: p.totalAmount,
          paymentType: p.paymentType,
          customerNumber: p.orderId?.customerId?.phone || "",
          products: p.orderId?.products?.map((item) => {
            return {
              productName: item?.productId?.name,
              sellingPrice: item?.sellingPrice,
              quantity: item?.quantity
            }
          }),
          date: p.orderId?.date,
          _id: p._id,
        }
      });

      return res.status(200).json({
        success: true,
        data: result,
      });
    }

    res.status(405).json({ message: "Method not allowed" });

  } catch (error) {
    console.error("PAYMENT API ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}