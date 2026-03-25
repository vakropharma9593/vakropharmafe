import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";

import Order from "@/models/Order";
import Product from "@/models/Product";
import Expense from "@/models/Expense";
import Inventory from "@/models/Inventory";
import CreditInventory from "@/models/CreditInventory";
import Customer from "@/models/Customer";
import { Types } from "mongoose";
import Payment from "@/models/Payment";

/** =========================
 * TYPES
 ========================== */

type OrderProduct = {
  productId: Types.ObjectId;
  quantity: number;
  sellingPrice: number;
  totalPrice: number;
};

type OrderType = {
  totalAmount: number;
  date: Date;
  customerId: { _id: Types.ObjectId };
  products: OrderProduct[];
  status: string;
};

type ProductType = {
  _id: Types.ObjectId;
  costPrice: number;
  mrp: number;
  gst: number;
};

type PaymentType = {
    _id: Types.ObjectId;
    orderId: Types.ObjectId;
    totalAmount: number;
    paymentType: string;
}

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
 * HANDLER for monthtly
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
      payments,
    ] = await Promise.all([
      Order.find().populate("customerId"),
      Expense.find(),
      Inventory.find().populate("productId"),
      CreditInventory.find(),
      Product.find(),
      Customer.find(),
      Payment.find(),
    ]);

    const typedOrders = orders as OrderType[];
    const typedExpenses = expenses as ExpenseType[];
    const typedInventories = inventories as InventoryType[];
    const typedCreditInventories = creditInventories as CreditInventoryType[];
    const typedProducts = products as ProductType[];
    const typedPayments = payments as PaymentType[];

    /** =========================
     * PRODUCT MAP
     ========================== */
    const productMap: Record<string, ProductType> = {};
    typedProducts.forEach((p) => {
      productMap[p._id.toString()] = p;
    });

    console.info("1. productMap: ", productMap);

    /** =========================
     * FINANCIALS
     ========================== */
    let totalOrdersAmount = 0; // sum of totalAmount of all orders
    let totalRevenue = 0; // total money earned from all paid orders (using payment table)

    let totalGST = 0;
    // let totalProfitOfOrders = 0;
    let totalCostOfOrders = 0;

    let unpaidOrders = {
        amount: 0,
        count: 0,
    }


    typedPayments.forEach((payment: PaymentType) => {
        totalRevenue += payment.totalAmount;
    });

    typedOrders.forEach((order) => {
      totalOrdersAmount += order.totalAmount;
      if (order.status === "Payment_Pending") {

        unpaidOrders = {
            amount: unpaidOrders.amount + order.totalAmount,
            count: unpaidOrders.count + 1,
        }
      }

      if (order.status !== "Payment_Pending") {
        order.products.forEach((item) => {
            const product = productMap[item.productId.toString()];
            if (!product) return;

            const revenue = item.totalPrice * item.quantity;
            const sellingPrice = item.sellingPrice * item.quantity;
            const gst = revenue - sellingPrice;
            const cost = product.costPrice * item.quantity;

            // totalNetRevenue += base;
            totalGST += gst;
            totalCostOfOrders += cost;
            // totalProfitOfOrders += sellingPrice - cost;
        });
        }
    });

    const netRevenue = totalRevenue - totalGST;
    // 

    let allExpenses = {
        cogs: 0,
        fixedOpex: 0,
        variable: 0,
        marketing: 0,
    }

    typedExpenses.forEach((item) => {
        const amount = item.amountPaid;
        allExpenses = {
            cogs: item?.purpose === "COGS" ? allExpenses.cogs + amount : allExpenses.cogs,
            fixedOpex: item?.purpose === "FIXED_OPEX" ? allExpenses.fixedOpex + amount : allExpenses.fixedOpex,
            marketing: item?.purpose === "MARKETING" ? allExpenses.marketing + amount : allExpenses.marketing,
            variable: item?.purpose === "VARIABLE" ? allExpenses.variable + amount : allExpenses.variable
        }
    })

    const totalPaidOrderPlaced = typedPayments?.length;

    const unitWiseAllExpenses = {
        cogs: allExpenses.cogs/totalPaidOrderPlaced,
        fixedOpex: allExpenses.fixedOpex/totalPaidOrderPlaced,
        variable: allExpenses.variable/totalPaidOrderPlaced,
        marketing: allExpenses.marketing/totalPaidOrderPlaced,
    }

    // const totalProfit = totalRevenue - totalExpense;
    // const totalProfitWithInventoryCost = totalProductProfit - totalExpense;

    // const realProfitAfterGST =
    //   totalRevenue - totalGST - totalCost - totalExpense;

    // const realMargin =
    //   totalRevenue > 0 ? (realProfitAfterGST / totalRevenue) * 100 : 0;

    /** =========================
     * UNIT ECONOMICS
     ========================== */
    const unitTotalRevenue = totalRevenue / totalPaidOrderPlaced;
    const unitNetRevenue = unitTotalRevenue - (totalGST/totalPaidOrderPlaced);
    const unitCM1 = unitNetRevenue - (totalCostOfOrders/totalPaidOrderPlaced);
    const unitCM2 = unitCM1 - (allExpenses.variable/totalPaidOrderPlaced);
    const unitCM3 = unitCM2 - (allExpenses.marketing/totalPaidOrderPlaced);
    const unitFinalProfit = unitCM3 - (allExpenses.fixedOpex/totalPaidOrderPlaced);
    const unitEconomics = {
        totalRevenue: unitTotalRevenue,
        netRevenue: unitNetRevenue,
        cm1: unitCM1,
        cm2: unitCM2,
        cm3: unitCM3,
        finalProfit: unitFinalProfit,
        profitMargin:  Number(((unitFinalProfit/unitTotalRevenue)*100).toFixed(2)),
    };

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
    const totalExpense = allExpenses.cogs + allExpenses.fixedOpex + allExpenses.marketing + allExpenses.variable;
    const grossProfit = netRevenue - totalExpense + inventoryValue;

    /** =========================
     * EXPENSE
     ========================== */
    // let fixedExpense = 0;
    // let variableExpense = 0;
    // let marketingExpense = 0;

    // typedExpenses.forEach((e) => {
    //   if (e.expenseCategory === "Fixed") fixedExpense += e.amountPaid;
    //   else variableExpense += e.amountPaid;

    //   if (e.purpose === "Marketing") marketingExpense += e.amountPaid;
    // });

    /** =========================
     * MONTHLY
     ========================== */
    // const monthly: MonthlyType = {};

    // typedOrders.forEach((order) => {
    //   const key = new Date(order.date).toISOString().slice(0, 7);

    //   if (!monthly[key]) {
    //     monthly[key] = { revenue: 0, orders: 0 };
    //   }

    //   monthly[key].revenue += order.totalAmount;
    //   monthly[key].orders += 1;
    // });

    /** =========================
     * BUSINESS
     ========================== */
    // const months = Object.keys(monthly).length || 1;
    // const burnRate = totalExpense / months;

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
        totalGST,
        totalExpense,
        grossProfit,
        unitEconomics
      },
      unitEconomics: unitEconomics,
      credit: {
        totalCredit,
        outstandingCredit,
      },
      inventory: {
        inventoryValue,
      },
      products: productMap,
    //   trends: {
    //     monthly,
    //   },
    //   business: {
    //     burnRate,
    //   },
      expenseBreakdown: allExpenses,
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