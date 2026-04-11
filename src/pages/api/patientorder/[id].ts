import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import { OrderStatusType } from "@/lib/utils";
import PatientOrder from "@/models/PatientOrder";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();

    if (req.method === "PATCH") {
      const { id } = req.query;
      const { status } = req.body;

      const existing = await PatientOrder.findById(id);
      if (!existing) {
          return res.status(404).json({
          success: false,
          message: "Patient Order not found",
          });
      }

      if (status === OrderStatusType.PAYMENT_DONE) {
        existing.paymentDate = req.body?.paymentDate || "";
        existing.paymentType = req.body?.paymentType || "";
      }

      if (status === OrderStatusType.DISPATCHED) {
        existing.deliveryService = req.body?.deliveryService;
        existing.deliveryTrackNumber= req.body?.deliveryTrackNumber;
      }

       existing.status = status;

      const order = await existing.save();

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