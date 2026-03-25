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
    sellingPrice: number;
    batch: string;
    quantity: number;
    totalPrice: number;
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

       const finalProducts = [];

      // 2️⃣ Check inventory & deduct stock
      for (const product of products) {

        const productData = await Product.findOne({
          _id: product.productId,
        });
        const sellingPrice = parseFloat(product.totalPrice)/(1 + (productData.gstPercentage/100));
        const sellingPriceToSave = Number(sellingPrice.toFixed(2));
        const profit = sellingPriceToSave - productData?.costPrice;
        const newProduct = { ...product, sellingPrice: sellingPriceToSave, costPrice: productData.costPrice, profit };
        finalProducts.push(newProduct);
      }

      // Calculate payment amount
      const totalAmount = products.reduce(
        (sum: number, p: { totalPrice: number, quantity: number }) => sum + p.totalPrice * p.quantity,
        0
      );

      const finalTotalAmount = Number(totalAmount.toFixed(2));
      
      // Create order
      const order = await PatientOrder.create({
        customerId: customerId,
        date,
        status,
        products: finalProducts,
        totalAmount: finalTotalAmount,
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
                        sellingPrice: p.sellingPrice,
                        discountPercentage: Number((((p?.productId?.mrp - p.totalPrice)/p?.productId?.mrp)*100).toFixed(2))
                      })),
            totalAmountPaid: o?.totalAmount || 0,
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