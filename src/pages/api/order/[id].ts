import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Payment from "@/models/Payment";
import "@/models/Customer";
import "@/models/Product";
import { OrderStatusType, PaymentStatusType } from "@/lib/utils";
import { generateInvoiceToken } from "@/lib/invoiceUtil";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();

    const { id } = req.query;

    if (req.method === "GET") {
      const { t } = req.query;
      if (!id || !t) {
        return res.status(400).json({
          success: false,
          message: "Order ID and token are required",
        });
      }

      const orderId = Array.isArray(id) ? id[0] : id;
      const token = Array.isArray(t) ? t[0] : t;

      if (!orderId || !token) {
        return res.status(400).json({
          success: false,
          message: "Order ID and token are required",
        });
      }

      const expectedToken = generateInvoiceToken(orderId);

      // 🔐 Validate token
      if (t !== expectedToken) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized access",
        });
      }

      const order = await Order.findById(id)
        .populate("customerId", "name phone type gst")
        .populate("products.productId", "name mrp");

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

       const dataToReturn = {
          _id: order._id,
          customerName: order.customerId?.name,
          customerPhone: order.customerId?.phone,
          customerType: order.customerId?.type,
          customerGst: order.customerId?.gst,
          paymentStatus: order.paymentStatus,
          date: order.date,
          products: order.products.map((p: { productId: { name: string, mrp: number }, quantity: number, totalPrice: number, sellingPrice: number, freeQuantity: number, }) => ({
            productName: p?.productId?.name,
            mrp: p?.productId?.mrp,
            quantity: p.quantity,
            freeQuantity: p.freeQuantity,
            totalPrice: p.totalPrice,
            sellingPrice: p.sellingPrice,
            discountPercentage: Number(
              (
                ((p?.productId?.mrp - p.totalPrice) /
                  p?.productId?.mrp) *
                100
              ).toFixed(2)
            ),
            totalGstPayable: Number(
              ((p.totalPrice - p.sellingPrice) * p.quantity).toFixed(2)
            ),
          })),
          totalAmountPaid: order?.totalAmount || 0,
        };

      return res.status(200).json({
        success: true,
        data: dataToReturn,
      });
    }

    if (req.method === "PATCH") {
      const { status, paymentStatus, paymentType } = req.body;

      const existing = await Order.findById(id);
      if (!existing) {
          return res.status(404).json({
          success: false,
          message: "Order not found",
          });
      }     
      
      const alreadyProcessed = existing.paymentStatus === "Payment_Done";

      if (paymentStatus === PaymentStatusType.PAYMENT_DONE) {
        existing.paymentDate = req.body?.paymentDate || "";
        existing.paymentType = req.body?.paymentType;
        existing.paymentStatus = paymentStatus;
      }

      if (status === OrderStatusType.DISPATCHED) {
        existing.deliveryService = req.body?.deliveryService;
        existing.deliveryTrackNumber = req.body?.deliveryTrackNumber;
        existing.status = status;
      }

      if (status === OrderStatusType.DELIVERED) {
        existing.status = status;
      }

      

      const order = await existing.save();

      if (paymentStatus === PaymentStatusType.PAYMENT_DONE && !alreadyProcessed) {
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