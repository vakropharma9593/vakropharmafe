import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";

import "@/models/Customer";
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
  customerId: {
    _id: string;
    name: string;
    phone: string;
  };
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
  itemName: string;
  batch: string;
  expiryDate: Date;
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

type AlertOrder = {
  customerName: string;
  phone: string;
  products: string[];
  lastOrderDate: Date;
};

type CustomerInsight = {
  name: string;
  phone: string;
  totalRevenue: number;
  orderCount: number;
};

type InventoryAlert = {
  itemName: string;
  batch: string;
  remainingCount: number;
  expiryDate?: Date;
};

type LossAlert = {
  productName: string;
  profit: number;
};

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
    alerts: {
        reorder: {
            oneMonth: AlertOrder[];
            sixMonth: AlertOrder[];
            oneYear: AlertOrder[];
        };
        inventory: {
            lowStock: InventoryAlert[];
            expiry: InventoryAlert[];
            lossMakingProducts: LossAlert[];
        };
    };
    customers: {
        topCustomers: CustomerInsight[];
        repeatCustomers: CustomerInsight[];
        revenuePerCustomer: number;
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

    const orders = await Order.find()
                        .populate("customerId")
                        .lean() as OrderType[];
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
     * ✅ REORDER ALERTS
     ========================== */

     const now = new Date();

    const getDateRange = (monthsAgoStart: number, monthsAgoEnd: number) => {
        const start = new Date();
        start.setMonth(start.getMonth() - monthsAgoStart);

        const end = new Date();
        end.setMonth(end.getMonth() - monthsAgoEnd);

        return { start, end };
    };

    const buildAlert = (ordersList: OrderType[]): AlertOrder[] => {
        return ordersList.map((o) => ({
            customerName: o.customerId?.name,
            phone: o.customerId?.phone,
            products: o.products.map((p) => p.productName),
            lastOrderDate: o.date,
        }));
    };

    const filterOrdersByRange = (start: Date, end: Date) => {
        return orders.filter(
            (o) => new Date(o.date) <= start && new Date(o.date) >= end
        );
    };

    const oneMonthRange = getDateRange(1, 2);
    const sixMonthRange = getDateRange(6, 7);
    const oneYearRange = getDateRange(12, 13);

    const reorderAlerts = {
        oneMonth: buildAlert(filterOrdersByRange(oneMonthRange.start, oneMonthRange.end)),
        sixMonth: buildAlert(filterOrdersByRange(sixMonthRange.start, sixMonthRange.end)),
        oneYear: buildAlert(filterOrdersByRange(oneYearRange.start, oneYearRange.end)),
    };

    /** =========================
     * ✅ CUSTOMER INSIGHTS
     ========================== */

    const customerMap: Record<string, CustomerInsight> = {};

    orders.forEach((o) => {
        const key = o.customerId?._id;

        if (!customerMap[key]) {
            customerMap[key] = {
            name: o.customerId?.name,
            phone: o.customerId?.phone,
            totalRevenue: 0,
            orderCount: 0,
            };
        }

        let orderRevenue = 0;
        o.products.forEach((p) => {
            orderRevenue += p.basePrice * p.quantity;
        });

        customerMap[key].totalRevenue += orderRevenue;
        customerMap[key].orderCount += 1;
    });

    const customersArray = Object.values(customerMap);

    const topCustomers = [...customersArray]
                        .sort((a, b) => b.totalRevenue - a.totalRevenue)
                        .slice(0, 5);

    const repeatCustomers = customersArray.filter((c) => c.orderCount > 1);

    const revenuePerCustomer = customersArray.length > 0
                            ? totalNetRevenue / customersArray.length
                            : 0;

     /** =========================
     * ✅ INVENTORY ALERTS
     ========================== */ 
     
    const lowStock: InventoryAlert[] = [];
    const expiry: InventoryAlert[] = [];

    const today = new Date();

    inventory.forEach((item: InventoryType) => {
        if (item.remainingCount < 10) {
            lowStock.push({
            itemName: item.itemName,
            batch: item.batch,
            remainingCount: item.remainingCount,
            });
        }

        if (item.expiryDate) {
            const expiryDate = new Date(item.expiryDate);
            const diff = (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

            if (diff < 30) {
            expiry.push({
                itemName: item.itemName,
                batch: item.batch,
                remainingCount: item.remainingCount,
                expiryDate,
            });
            }
        }
    });

     /** =========================
     * ✅ LOSS ALERTS
     ========================== */

    const lossMakingProducts: LossAlert[] = [];

    Object.keys(productMap).forEach((key) => {
        if (productMap[key].profit < 0) {
            lossMakingProducts.push({
                productName: key,
                profit: productMap[key].profit,
            });
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