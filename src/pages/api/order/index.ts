import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Payment from "@/models/Payment";
import Inventory from "@/models/Inventory";
import CreditInventory from "@/models/CreditInventory";
import "@/models/Customer"; 
import Product from "@/models/Product";
import { OrderStatusType } from "@/lib/utils";

interface OrderWithCustomer {
  _id: string;
  customerId?: {
    name: string;
    phone: string;
  };
  date: Date;
  status: string;
  totalAmount: number;
  products: {
    productId: {
      _id: string;
      name: string;
      mrp: number;
      costPrice: number;
    },
    batchId: {
      batch: string;
    };
    productName: string;
    sellingPrice: number;
    batch: string;
    quantity: number;
    totalPrice: number;
    profit: number;
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
      const { customerId, date, status, products, paymentType, orderType, creditId } = req.body;

       const finalProducts = [];

      // 2️⃣ Check inventory & deduct stock
      for (const product of products) {
        const inventory = await Inventory.findOne({
          _id: product.batchId,
        });

        if (!inventory) {
          return res.status(400).json({
            success: false,
            message: `Inventory not found for batch ${product.batchId}`
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

        if (orderType === "CREDIT") {
          const creditInventory = await CreditInventory.findOne({
            _id: creditId
          });

          if (creditInventory.remainingCount < product.quantity) {
            return res.status(400).json({
              success: false,
              message: `Not enough CREDIT stock for ${product.productName} batch ${product.batch}`
            });
          }

          creditInventory.remainingCount -= product.quantity;
          await creditInventory.save();
        }

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
      const order = await Order.create({
        customerId: customerId,
        date,
        status,
        products: finalProducts,
        totalAmount: finalTotalAmount
      });

      if (status !== OrderStatusType.PAYMENT_PENDING) {
        // Save payment if order is paid or above status
        await Payment.create({
          orderId: order._id,
          totalAmount: finalTotalAmount,
          paymentType
        });
      }

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
      const orders = await Order.find()
        .populate("customerId", "name phone")
        .populate("products.productId", "name mrp costPrice")
        .populate("products.batchId", "batch")
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
                        discountPercentage: Number((((p?.productId?.mrp - p.totalPrice)/p?.productId?.mrp)*100).toFixed(2)),
                        totalCostPrice: Number((p?.productId?.costPrice * p.quantity).toFixed(2)),
                        totalGstPayable: Number(((p.totalPrice - p.sellingPrice)*p.quantity).toFixed(2)),
                        totalProfit: Number((p.profit*p.quantity).toFixed(2)),
                      })),
            totalAmountPaid: o?.totalAmount || 0,
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