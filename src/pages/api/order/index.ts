import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Payment from "@/models/Payment";
import Inventory from "@/models/Inventory";
import CreditInventory from "@/models/CreditInventory";
import "@/models/Customer"; 
import Product from "@/models/Product";
import { OrderStatusType, OrderType } from "@/lib/utils";
import { ObjectId } from "mongoose";
import Customer from "@/models/Customer";

interface OrderWithCustomer {
  _id: string;
  customerId?: {
    name: string;
    phone: string;
  };
  date: Date;
  paymentDate: Date;
  status: string;
  orderType: string;
  deliveryService: string;
  deliveryTrackNumber: string;
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
      const { customerId, date, status, paymentDate, products, paymentType, orderType, creditId } = req.body;

      const finalProducts = [];

      let creditInventory;
      let creditProducts;

      if (orderType === "CREDIT" && creditId) {
        creditInventory = await CreditInventory.findOne({
              _id: creditId
            });
        creditProducts = creditInventory.products;
      }


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

        if (orderType === "CREDIT") {
          const index = creditProducts.findIndex((item: { productId: ObjectId }) => item.productId.toString() === product.productId)
          if (index !== -1) {
            const currentProduct = creditProducts[index];
            currentProduct.remainingUnit = currentProduct.remainingUnit - product.quantity
            creditProducts[index] = currentProduct;
          } else {
            return res.status(400).json({
              success: false,
              message: `No product found in credit inventory.`
            });
          }
        }

        const productData = await Product.findOne({
          _id: product.productId,
        });

        const sellingPrice = parseFloat(product.totalPrice)/(1 + (productData.gstPercentage/100));
        const sellingPriceToSave = Number(sellingPrice.toFixed(2));
        const profit = sellingPriceToSave - productData?.costPrice;
        const newProduct = { ...product, sellingPrice: sellingPriceToSave, costPrice: productData.costPrice, profit };
        finalProducts.push(newProduct);

        await inventory.save();
      }

      if (orderType === "CREDIT" && creditId) {
        creditInventory.products = creditProducts;
        await creditInventory.save();
      }

      // Calculate payment amount
      const totalAmount = products.reduce(
        (sum: number, p: { totalPrice: number, quantity: number }) => sum + p.totalPrice * p.quantity,
        0
      );

      const finalTotalAmount = Number(totalAmount.toFixed(2));

      let deliveryService: string = ""
      let deliveryTrackNumber: string = ""

      if (status === OrderStatusType.DISPATCHED) {
        deliveryService = req.body?.deliveryService;
        deliveryTrackNumber= req.body?.deliveryTrackNumber;
      }

      const orderTypeToSave = orderType === "CREDIT" ? OrderType.CREDIT_ORDER :  OrderType.DIRECT_CUSTOMER;
      
      // Create order
      const order = await Order.create({
        customerId: customerId,
        date,
        status,
        paymentDate,
        orderType: orderTypeToSave,
        products: finalProducts,
        totalAmount: finalTotalAmount,
        deliveryService,
        deliveryTrackNumber
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
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = (req.query.search as string) || "";

      const skip = (page - 1) * limit;

      // 🔍 Step 1: Find matching customers (for search)
      let customerFilter: Record<string, unknown> = {};

      if (search) {
        const searchRegex = new RegExp(`^${search}`, "i"); // prefix for index usage

        const customers = await Customer.find({
          $or: [
            { name: searchRegex },
            { phone: searchRegex },
          ],
        }).select("_id");

        const customerIds = customers.map((c) => c._id);

        customerFilter = { customerId: { $in: customerIds } };
      }

      // ✅ Step 2: Total count (with filter)
      const total = await Order.countDocuments(customerFilter);

      // ✅ Step 3: Fetch paginated orders
      const orders = await Order.find(customerFilter)
        .populate("customerId", "name phone")
        .populate("products.productId", "name mrp costPrice")
        .populate("products.batchId", "batch")
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      // ✅ Step 4: Get payments only for fetched orders
      const orderIds = orders.map((o) => o._id);

      const payments = await Payment.find({
        orderId: { $in: orderIds },
      });

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

      // ✅ Step 5: Transform response
      const result = orders.map((o: OrderWithCustomer) => {
        const payment = paymentMap.get(o._id.toString());

        return {
          _id: o._id,
          customerId: o.customerId,
          customerName: o.customerId?.name,
          customerPhone: o.customerId?.phone,
          date: o.date,
          status: o.status,
          orderType: o.orderType,
          paymentDate: o.paymentDate,
          deliveryService: o.deliveryService,
          deliveryTrackNumber: o.deliveryTrackNumber,

          products: o.products.map((p) => ({
            productId: p?.productId?._id,
            productName: p?.productId?.name,
            batch: p.batchId?.batch,
            quantity: p.quantity,
            totalPrice: p.totalPrice,
            sellingPrice: p.sellingPrice,
            discountPercentage: Number(
              (
                ((p?.productId?.mrp - p.totalPrice) /
                  p?.productId?.mrp) *
                100
              ).toFixed(2)
            ),
            totalCostPrice: Number(
              (p?.productId?.costPrice * p.quantity).toFixed(2)
            ),
            totalGstPayable: Number(
              ((p.totalPrice - p.sellingPrice) * p.quantity).toFixed(2)
            ),
            totalProfit: Number((p.profit * p.quantity).toFixed(2)),
          })),

          totalAmountPaid: o?.totalAmount || 0,
          paymentType: payment?.paymentType || null,
        };
      });

      return res.status(200).json({
        success: true,
        data: result,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
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