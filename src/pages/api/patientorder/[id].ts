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

      let deliveryService: string = existing.deliveryService;
      let deliveryTrackNumber: string = existing.deliveryTrackNumber;

      if (status === OrderStatusType.DISPATCHED) {
        deliveryService = req.body?.deliveryService;
        deliveryTrackNumber= req.body?.deliveryTrackNumber;
      }

      const order = await PatientOrder.findByIdAndUpdate(
        id,
        { status, deliveryService, deliveryTrackNumber },
        { new: true }
      );

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