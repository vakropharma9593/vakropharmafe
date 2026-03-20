import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";

import Order from "@/models/Order";
import Expense from "@/models/Expense";
import Inventory from "@/models/Inventory";
import CreditInventory from "@/models/CreditInventory";

/** =========================
 * 🧾 TYPES
 ========================== */

type Product = {
  productName: string;
  sellingPrice: number;
  basePrice: number;
  costPrice: number;
  quantity: number;
};

type OrderType = {
  date: Date;
  products: Product[];
};

type ExpenseType = {
  amountPaid: number;
  paymentDate: Date;
  expenseCategory: string;
  purpose: string;
};

type InventoryType = {
  remainingCount: number;
  costPrice: number;
};

type MonthlyData = {
  revenue: number;
  expense: number;
  profit: number;
};

type ProductInsight = {
  quantity: number;
  revenue: number;
  profit: number;
};

type CreditInventoryType = {
    batch: string;
    itemName: string;
    totalCount: number;
    remainingCount: number;
    customerId: string;
}

type InsightsResponse = {
  success: boolean;
  data: {
    financial: {
      totalRevenue: number;
      totalNetRevenue: number;
      totalGST: number;
      totalExpense: number;
      totalProfit: number;
      totalProductProfit: number;
      totalProfitWithInventoryCost: number;
    };
    inventory: {
      inventoryValue: number;
    };
    products: Record<string, ProductInsight>;
    trends: {
      monthly: Record<string, MonthlyData>;
    };
    business: {
      burnRate: number;
    };
    creditInventory: {
        totalCount: number;
        remainingCount: number;
    };
    expenseBreakdown: {
        fixed: number;
        variable: number;
        marketing: number;
    };
  };
};

/** =========================
 * 🚀 API
 ========================== */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<InsightsResponse | { message: string }>
) {
  try {
    await connectDB();

    if (req.method !== "GET") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    const orders = (await Order.find().lean()) as OrderType[];
    const expenses = (await Expense.find().lean()) as ExpenseType[];
    const inventory = (await Inventory.find().lean()) as InventoryType[];
    const creditInventory = (await CreditInventory.find().lean() as CreditInventoryType[]);

    /** =========================
     * 💰 FINANCIAL
     ========================== */
    let totalRevenue = 0;
    let totalNetRevenue = 0;
    let totalProductProfit = 0;


    const productMap: Record<string, ProductInsight> = {};

    orders.forEach((order) => {
      order.products.forEach((p) => {
        const selling = p.sellingPrice * p.quantity;
        const base = p.basePrice * p.quantity;
        const cost = p.costPrice * p.quantity;

        totalRevenue += selling;
        totalNetRevenue += base;

        const profit = base - cost;
        totalProductProfit += profit;

        if (!productMap[p.productName]) {
          productMap[p.productName] = {
            quantity: 0,
            revenue: 0,
            profit: 0,
          };
        }

        productMap[p.productName].quantity += p.quantity;
        productMap[p.productName].revenue += base;
        productMap[p.productName].profit += profit;
      });
    });

    const totalGST = totalRevenue - totalNetRevenue;

    const totalExpense = expenses.reduce(
      (sum, e) => sum + e.amountPaid,
      0
    );

    const totalProfit = totalNetRevenue - totalExpense;

    /** =========================
     * 📦 INVENTORY
     ========================== */
    let inventoryValue = 0;

    inventory.forEach((item) => {
      inventoryValue += item.remainingCount * item.costPrice;
    });

    const totalProfitWithInventoryCost = totalProfit + inventoryValue;

     /** =========================
     * 📦 CREDIT INVENTORY
     ========================== */

    let totalCountOfCreditInventory = 0;
    let remainingCountOfCreditInventory = 0;

    creditInventory.forEach((item) => {
        totalCountOfCreditInventory += item?.totalCount;
        remainingCountOfCreditInventory += item?.remainingCount;
    })

    /** =========================
     * 📅 MONTHLY
     ========================== */
    const monthly: Record<string, MonthlyData> = {};

    orders.forEach((order) => {
      const month = new Date(order.date).toISOString().slice(0, 7);

      if (!monthly[month]) {
        monthly[month] = { revenue: 0, expense: 0, profit: 0 };
      }

      order.products.forEach((p) => {
        monthly[month].revenue += p.basePrice * p.quantity;
      });
    });

    expenses.forEach((e) => {
      const month = new Date(e.paymentDate).toISOString().slice(0, 7);

      if (!monthly[month]) {
        monthly[month] = { revenue: 0, expense: 0, profit: 0 };
      }

      monthly[month].expense += e.amountPaid;
    });

    Object.keys(monthly).forEach((m) => {
      monthly[m].profit = monthly[m].revenue - monthly[m].expense;
    });

    /** =========================
     * 🔥 BURN RATE
     ========================== */
    const months = Object.keys(monthly).length || 1;
    const burnRate = totalExpense / months;

    /** =========================
     * 💸 EXPENSE BREAKDOWN
     ========================== */

    let fixedExpense = 0;
    let variableExpense = 0;
    let marketingExpense = 0;

    expenses.forEach((e) => {
    // Fixed / Variable split
    if (e.expenseCategory === "Fixed") {
        fixedExpense += e.amountPaid;
    } else {
        variableExpense += e.amountPaid;
    }

    // Marketing specific
    if (e.purpose === "Marketing") {
        marketingExpense += e.amountPaid;
    }
    });

    /** =========================
     * ✅ RESPONSE
     ========================== */
    return res.status(200).json({
      success: true,
      data: {
        financial: {
          totalRevenue,
          totalNetRevenue,
          totalGST,
          totalExpense,
          totalProfit,
          totalProductProfit,
          totalProfitWithInventoryCost,
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
        creditInventory: {
            totalCount: totalCountOfCreditInventory,
            remainingCount: remainingCountOfCreditInventory,
        },
        expenseBreakdown: {
            fixed: fixedExpense,
            variable: variableExpense,
            marketing: marketingExpense,
        },
      },
    });

  } catch (err) {
    console.error("INSIGHTS API ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
}