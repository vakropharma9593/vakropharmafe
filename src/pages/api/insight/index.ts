import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import mongoose, { Types } from "mongoose";

import Order from "@/models/Order";
import Product from "@/models/Product";
import Expense from "@/models/Expense";
import Inventory from "@/models/Inventory";
import CreditInventory from "@/models/CreditInventory";
import Customer from "@/models/Customer";

/** =========================
 * TYPES
 ========================== */

type OrderProduct = {
  productId: Types.ObjectId;
  quantity: number;
  sellingPrice: number;
  basePrice: number;
};

type OrderType = {
  totalAmount: number;
  date: Date;
  customerId: { _id: Types.ObjectId };
  products: OrderProduct[];
};

type ProductType = {
  _id: Types.ObjectId;
  costPrice: number;
  mrp: number;
};

type ExpenseType = {
  amountPaid: number;
  expenseCategory: "Fixed" | "Variable";
  purpose?: string;
};

type InventoryType = {
  productId: {
    _id: Types.ObjectId;
  };
  remainingCount: number;
  totalCount: number;
  expiryDate: Date;
};

type CreditInventoryType = {
  totalCount: number;
  remainingCount: number;
};

type MonthlyType = Record<
  string,
  {
    revenue: number;
    orders: number;
  }
>;

/** =========================
 * HANDLER
 ========================== */

export default async function getInsights(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  await connectDB();

  try {
    /** =========================
     * FETCH DATA
     ========================== */
    const [
      orders,
      expenses,
      inventories,
      creditInventories,
      products,
      customers,
    ] = await Promise.all([
      Order.find().populate("customerId"),
      Expense.find(),
      Inventory.find().populate("productId"),
      CreditInventory.find(),
      Product.find(),
      Customer.find(),
    ]);

    const typedOrders = orders as unknown as OrderType[];
    const typedExpenses = expenses as ExpenseType[];
    const typedInventories = inventories as InventoryType[];
    const typedCreditInventories = creditInventories as CreditInventoryType[];
    const typedProducts = products as ProductType[];

    /** =========================
     * PRODUCT MAP
     ========================== */
    const productMap: Record<string, ProductType> = {};
    typedProducts.forEach((p) => {
      productMap[p._id.toString()] = p;
    });

    /** =========================
     * FINANCIALS
     ========================== */
    let totalRevenue = 0;
    let totalNetRevenue = 0;
    let totalGST = 0;
    let totalProductProfit = 0;
    let totalCost = 0;

    typedOrders.forEach((order) => {
      totalRevenue += order.totalAmount;

      order.products.forEach((item) => {
        const product = productMap[item.productId.toString()];
        if (!product) return;

        const revenue = item.sellingPrice * item.quantity;
        const base = item.basePrice * item.quantity;
        const gst = revenue - base;
        const cost = product.costPrice * item.quantity;

        totalNetRevenue += base;
        totalGST += gst;
        totalCost += cost;
        totalProductProfit += base - cost;
      });
    });

    const totalExpense = typedExpenses.reduce(
      (sum, e) => sum + e.amountPaid,
      0
    );

    const totalProfit = totalRevenue - totalExpense;
    const totalProfitWithInventoryCost = totalProductProfit - totalExpense;

    const grossProfit = totalNetRevenue - totalCost;
    const netProfit = grossProfit - totalExpense;

    const realProfitAfterGST =
      totalRevenue - totalGST - totalCost - totalExpense;

    const realMargin =
      totalRevenue > 0 ? (realProfitAfterGST / totalRevenue) * 100 : 0;

    /** =========================
     * UNIT ECONOMICS
     ========================== */
    let totalUnits = 0;
    let totalSelling = 0;
    let totalCostUnit = 0;

    typedOrders.forEach((order) => {
      order.products.forEach((item) => {
        const product = productMap[item.productId.toString()];
        if (!product) return;

        totalUnits += item.quantity;
        totalSelling += item.sellingPrice * item.quantity;
        totalCostUnit += product.costPrice * item.quantity;
      });
    });

    const sellingPrice = totalUnits ? totalSelling / totalUnits : 0;
    const costPrice = totalUnits ? totalCostUnit / totalUnits : 0;
    const profitPerUnit = sellingPrice - costPrice;
    const margin = sellingPrice
      ? (profitPerUnit / sellingPrice) * 100
      : 0;

    /** =========================
     * CREDIT
     ========================== */
    let totalCredit = 0;
    let outstandingCredit = 0;

    typedCreditInventories.forEach((c) => {
      totalCredit += c.totalCount;
      outstandingCredit += c.remainingCount;
    });

    /** =========================
     * INVENTORY
     ========================== */
    let inventoryValue = 0;
    const lowStock: InventoryType[] = [];
    const expiry: InventoryType[] = [];

    const now = new Date();

    typedInventories.forEach((inv) => {
      const product = productMap[inv.productId._id.toString()];
      if (!product) return;

      inventoryValue += inv.remainingCount * product.costPrice;

      if (inv.remainingCount < inv.totalCount * 0.2) {
        lowStock.push(inv);
      }

      const diffDays =
        (new Date(inv.expiryDate).getTime() - now.getTime()) /
        (1000 * 60 * 60 * 24);

      if (diffDays < 30) {
        expiry.push(inv);
      }
    });

    /** =========================
     * EXPENSE
     ========================== */
    let fixedExpense = 0;
    let variableExpense = 0;
    let marketingExpense = 0;

    typedExpenses.forEach((e) => {
      if (e.expenseCategory === "Fixed") fixedExpense += e.amountPaid;
      else variableExpense += e.amountPaid;

      if (e.purpose === "Marketing") marketingExpense += e.amountPaid;
    });

    /** =========================
     * MONTHLY
     ========================== */
    const monthly: MonthlyType = {};

    typedOrders.forEach((order) => {
      const key = new Date(order.date).toISOString().slice(0, 7);

      if (!monthly[key]) {
        monthly[key] = { revenue: 0, orders: 0 };
      }

      monthly[key].revenue += order.totalAmount;
      monthly[key].orders += 1;
    });

    /** =========================
     * BUSINESS
     ========================== */
    const months = Object.keys(monthly).length || 1;
    const burnRate = totalExpense / months;

    /** =========================
     * CUSTOMER INSIGHTS
     ========================== */
    const customerRevenue: Record<string, number> = {};
    const customerOrders: Record<string, number> = {};

    typedOrders.forEach((o) => {
      const id = o.customerId._id.toString();

      customerRevenue[id] = (customerRevenue[id] || 0) + o.totalAmount;
      customerOrders[id] = (customerOrders[id] || 0) + 1;
    });

    const topCustomers = Object.entries(customerRevenue)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const repeatCustomers = Object.entries(customerOrders).filter(
      ([, count]) => count > 1
    );

    const revenuePerCustomer =
      Object.keys(customerRevenue).length > 0
        ? totalRevenue / Object.keys(customerRevenue).length
        : 0;

    /** =========================
     * ALERTS
     ========================== */
    const reorderAlerts = lowStock;

    const lossMakingProducts: ProductType[] = [];

    typedProducts.forEach((p) => {
      if (p.costPrice > p.mrp) {
        lossMakingProducts.push(p);
      }
    });

    /** =========================
     * RESPONSE
     ========================== */
    return res.status(200).json({
      financial: {
        totalRevenue,
        totalNetRevenue,
        totalGST,
        totalExpense,
        totalProfit,
        totalProductProfit,
        totalProfitWithInventoryCost,
        grossProfit,
        netProfit,
        realProfitAfterGST,
        realMargin,
      },
      unitEconomics: {
        sellingPrice,
        costPrice,
        profitPerUnit,
        margin,
      },
      credit: {
        totalCredit,
        outstandingCredit,
      },
      inventory: {
        inventoryValue,
      },
      products: productMap,
      trends: {
        monthly,
      },
      business: {
        burnRate,
      },
      expenseBreakdown: {
        fixed: fixedExpense,
        variable: variableExpense,
        marketing: marketingExpense,
      },
      alerts: {
        reorder: reorderAlerts,
        inventory: {
          lowStock,
          expiry,
          lossMakingProducts,
        },
      },
      customers: {
        topCustomers,
        repeatCustomers,
        revenuePerCustomer,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch insights" });
  }
}