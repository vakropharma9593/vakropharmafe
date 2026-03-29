import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import "@/models/Customer"; 
import Product from "@/models/Product";
import { PaymentModeType } from "@/lib/utils";
import PatientOrder from "@/models/PatientOrder";

interface OrderWithCustomer {
  _id: string;
  customerId?: {
    name: string;
    phone: string;
  };
  date: Date;
  status: string;
  totalAmount: number;
  totalAccountAmount: number;
  paymentType: PaymentModeType;
  products: {
    productId: {
      _id: string;
      name: string;
      mrp: number;
    },
    batchId: {
      batch: string;
    };
    productName: string;
    totalPrice: number;
    batch: string;
    quantity: number;
    accountTotalPrice: number;
    discountPercentage: number;
  }[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();

    // CREATE ORDER
    if (req.method === "POST") {
      const { customerId, date, status, products, paymentType } = req.body;
    

      // Calculate payment amount
      const totalAmount = products.reduce(
        (sum: number, p: { totalPrice: number, quantity: number }) => sum + p.totalPrice * p.quantity,
        0
      );

      const totalAccountAmount = products.reduce(
        (sum: number, p: { accountTotalPrice: number, quantity: number }) => sum + p.accountTotalPrice * p.quantity,
        0
      );

      const finalTotalAmount = Number(totalAmount.toFixed(2));
      
      // Create order
      const order = await PatientOrder.create({
        customerId: customerId,
        date,
        status,
        products: products,
        totalAmount: finalTotalAmount,
        totalAccountAmount,
        paymentType: paymentType,
      });

      const result = {
            id: order._id,
            date: order.date,
            status: order.status,
            products: order.products,
            totalAmountPaid: finalTotalAmount,
        };

      return res.status(201).json({
        success: true,
        data: result,
      });
    }

    // GET ORDERS
    if (req.method === "GET") {
      const orders = await PatientOrder.find()
        .populate("customerId", "name phone")
        .populate("products.productId", "name mrp")
        .populate("products.batchId", "batch")
        .lean();

      const result = orders.map((o: OrderWithCustomer) => {

        return {
            _id: o._id,
            customerId: o.customerId,
            customerName: o.customerId?.name,
            customerPhone: o.customerId?.phone,
            date: o.date,
            status: o.status,
            products: o.products.map((p) => ({
                        productId: p?.productId?._id,
                        productName: p?.productId?.name,
                        batch: p.batchId?.batch,
                        quantity: p.quantity,
                        totalPrice: p.totalPrice,
                        accountTotalPrice: p.accountTotalPrice,
                        discountPercentage: p.discountPercentage
                      })),
            totalAmountPaid: o?.totalAmount || 0,
            totalAccountAmountPaid: o?.totalAccountAmount,
            paymentType: o?.paymentType || null,
        };
      });

      return res.status(200).json({
        success: true,
        data: result
      });
    }

    res.status(405).json({ message: "Method Not Allowed" });

  } catch (error) {
    console.error("ORDER API ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
}