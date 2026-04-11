import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Payment from "@/models/Payment";
import { OrderStatusType } from "@/lib/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();

    if (req.method === "PATCH") {
      const { id } = req.query;
      const { status, paymentType } = req.body;

      const existing = await Order.findById(id);
      if (!existing) {
          return res.status(404).json({
          success: false,
          message: "Order not found",
          });
      }     
      
      const alreadyProcessed = existing.status === "Payment_Done";

      if (status === OrderStatusType.PAYMENT_DONE) {
        existing.paymentDate = req.body?.paymentDate || "";
      }

      if (status === OrderStatusType.DISPATCHED) {
        existing.deliveryService = req.body?.deliveryService;
        existing.deliveryTrackNumber = req.body?.deliveryTrackNumber;
      }

      existing.status = status;

      const order = await existing.save();

      if (status === OrderStatusType.PAYMENT_DONE && !alreadyProcessed) {
        await Payment.create({
          orderId: order._id,
          totalAmount: order.totalAmount,
          paymentType,
        });
      }

      return res.status(200).json({
        success: true,
        data: order
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