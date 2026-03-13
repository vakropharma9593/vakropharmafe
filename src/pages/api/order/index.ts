import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import Customer from "@/models/Customer";
import Order from "@/models/Order";
import Payment from "@/models/Payment";
import Inventory from "@/models/Inventory";

interface OrderWithCustomer {
  _id: string;
  customerId?: {
    name: string;
  };
  date: Date;
  status: string;
  products: {
    productName: string;
    sellingPrice: number;
    batch: string;
    quantity: number;
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
      const { customerPhone, date, status, products, paymentType } = req.body;

      // 1️⃣ Get customer
      const customer = await Customer.findOne({ phone: customerPhone });

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: "Customer not found"
        });
      }

      // 2️⃣ Check inventory & deduct stock
      for (const product of products) {
        const inventory = await Inventory.findOne({
          batch: product.batch,
          itemName: product.productName
        });

        if (!inventory) {
          return res.status(400).json({
            success: false,
            message: `Inventory not found for batch ${product.batch}`
          });
        }

        if (inventory.remainingCount < product.quantity) {
          return res.status(400).json({
            success: false,
            message: `Not enough stock for ${product.productName} batch ${product.batch}`
          });
        }

        inventory.remainingCount -= product.quantity;
        await inventory.save();
      }

      // 3️⃣ Create order
      const order = await Order.create({
        customerId: customer._id,
        date,
        status,
        products
      });

      // 4️⃣ Calculate payment amount
      const totalAmount = products.reduce(
        (sum: number, p: { sellingPrice: number, quantity: number }) => sum + p.sellingPrice * p.quantity,
        0
      );

      // 5️⃣ Save payment
      const payment = await Payment.create({
        orderId: order._id,
        totalAmount,
        paymentType
      });

      const result = {
            id: order._id,
            customerName: customer?.name,
            date: order.date,
            status: order.status,
            products: order.products,
            totalAmountPaid: payment?.totalAmount || 0,
            paymentType: payment?.paymentType || null,
        };

      return res.status(201).json({
        success: true,
        data: result,
      });
    }

    // GET ORDERS
    if (req.method === "GET") {
      const orders = await Order.find()
        .populate("customerId", "name")
        .lean();

      const payments = await Payment.find();

      const paymentMap = new Map<
        string,
        { totalAmount: number; paymentType: string }
      >();
      payments.forEach((p) => {
        paymentMap.set(p.orderId.toString(), {
            totalAmount: p.totalAmount,
            paymentType: p.paymentType,
        });
      });

      const result = orders.map((o: OrderWithCustomer) => {
        const payment = paymentMap.get(o._id.toString());

        return {
            id: o._id,
            customerName: o.customerId?.name,
            date: o.date,
            status: o.status,
            products: o.products,
            totalAmountPaid: payment?.totalAmount || 0,
            paymentType: payment?.paymentType || null,
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