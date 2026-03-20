import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Payment from "@/models/Payment";
import Inventory from "@/models/Inventory";
import CreditInventory from "@/models/CreditInventory";
import "@/models/Customer"; 

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
      const { customerId, customerName, date, status, products, paymentType, orderType } = req.body;

       const finalProducts = [];

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

        if (orderType === "CREDIT") {
          const creditInventory = await CreditInventory.findOne({
            batch: product.batch,
            itemName: product.productName,
            customerId: customerId
          });

          if (!creditInventory) {
            return res.status(400).json({
              success: false,
              message: `Credit inventory not found for ${product.productName} (batch ${product.batch}) for this customer`
            });
          }

          if (creditInventory.remainingCount < product.quantity) {
            return res.status(400).json({
              success: false,
              message: `Not enough CREDIT stock for ${product.productName} batch ${product.batch}`
            });
          }

          creditInventory.remainingCount -= product.quantity;
          await creditInventory.save();
        }

        const basePrice = parseFloat(product.sellingPrice)/(1 + (inventory.gstPercentage/100));
        const basePriceToSave = Number(basePrice.toFixed(2));
        const newProduct = { ...product, basePrice: basePriceToSave, costPrice: inventory.costPrice };
        finalProducts.push(newProduct);
      }
      
      // 3️⃣ Create order
      const order = await Order.create({
        customerId: customerId,
        date,
        status,
        products: finalProducts,
      });

      // 4️⃣ Calculate payment amount
      const totalAmount = products.reduce(
        (sum: number, p: { sellingPrice: number, quantity: number }) => sum + p.sellingPrice * p.quantity,
        0
      );

      const finalTotalAmount = Number(totalAmount.toFixed(2));

      // 5️⃣ Save payment
      const payment = await Payment.create({
        orderId: order._id,
        totalAmount: finalTotalAmount,
        paymentType
      });

      const result = {
            id: order._id,
            customerName: customerName,
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