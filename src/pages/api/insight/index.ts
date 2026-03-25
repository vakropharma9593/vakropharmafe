import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Inventory from "@/models/Inventory";
import { Types } from "mongoose";
import Expense from "@/models/Expense";
import { ExpenseCategoryType } from "@/lib/utils";

/** =========================
 * TYPES
 ========================== */

type BatchInfo = {
  batch: string;
  totalCount: number;
  remainingCount: number;
  inventoryValue: number;
  expiryDate: Date;
};

type ProductInventory = {
  batches: BatchInfo[];
  totalInventoryValue: number;
  totalRemaining: number;
};

type ExpiryAlert = {
  productName: string;
  batch: string;
  remainingCount: number;
  expiryDate: Date;
};


type ProductType = {
  _id: Types.ObjectId;
  costPrice: number;
  name: string;
  mrp: number;
  gstPercentage: number;
};

/** =========================
 * HANDLER for overall
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
      inventories,
      products,
      expenses,
    ] = await Promise.all([
      Inventory.find()
        .populate({
            path: "productId",
            select: "name costPrice",
        })
        .lean(),
      Product.find(),
      Expense.find(),
    ]);

    const typedProducts = products as ProductType[];

    /** =========================
     * PRODUCT MAP
     ========================== */
    const productMap: Record<string, ProductType> = {};
    typedProducts.forEach((p) => {
      productMap[p._id.toString()] = p;
    });

    /** =========================
     * INVENTORY
     ========================== */
    const productWiseInventory: Record<string, ProductInventory> = {};
    let totalInventoryValue = 0;

    const today = new Date();
    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

    const expiryAlerts: ExpiryAlert[] = [];

    for (const inv of inventories) {
        const productId = inv.productId?._id;
        const costPrice = inv.productId?.costPrice || 0;

        if (!productId) continue;

        const inventoryValue = inv.remainingCount * costPrice;

        // Initialize product bucket
        if (!productWiseInventory[productId]) {
            productWiseInventory[productId] = {
            batches: [],
            totalInventoryValue: 0,
            totalRemaining: 0,
            };
        }

        // Push batch data
        productWiseInventory[productId].batches.push({
            batch: inv.batch,
            totalCount: inv.totalCount,
            remainingCount: inv.remainingCount,
            inventoryValue,
            expiryDate: inv.expiryDate,
        });

        // Aggregate per product
        productWiseInventory[productId].totalInventoryValue += inventoryValue;
        productWiseInventory[productId].totalRemaining += inv.remainingCount;

        // Aggregate overall
        totalInventoryValue += inventoryValue;

        // ✅ Expiry Alert Logic
        if (new Date(inv.expiryDate).getTime() - today.getTime() <= THIRTY_DAYS) {
            expiryAlerts.push({
              productName: productId?.name,
              batch: inv.batch,
              remainingCount: inv.remainingCount,
              expiryDate: inv.expiryDate,
            });
        }
    }

    /** =========================
     * Expenses
     ========================== */
    
    const totalExpenses = {
      cogs: 0,
      fixedOpex: 0,
      marketing: 0,
      variable: 0,
    };

    expenses.forEach((exp) => {
      switch (exp.expenseCategory) {
        case ExpenseCategoryType.COGS:
          totalExpenses.cogs += exp.amountPaid;
          break;

        case ExpenseCategoryType.MARKETING:
          totalExpenses.marketing += exp.amountPaid;
          break;

        case ExpenseCategoryType.FIXED_OPEX:
          totalExpenses.fixedOpex += exp.amountPaid;
          break;

        case ExpenseCategoryType.VARIABLE:
          totalExpenses.variable += exp.amountPaid;
          break;
      }
    });

    const totalExpensesAmount = Object.values(totalExpenses)?.reduce((sum: number, item: number) => {
      sum += item;
      return sum;
    },0)

    const productWiseExpenses: Record<
      string,
      {
        name: string;
        cogs: number;
        marketing: number;
        fixedOpex: number;
        variable: number;
      }
    > = {};

    typedProducts.forEach((p) => {
      productWiseExpenses[p._id.toString()] = {
        name: p.name,
        cogs: 0,
        marketing: 0,
        fixedOpex: 0,
        variable: 0,
      };
    });

    expenses.forEach((exp) => {
      if (exp.expenseCategory === "COGS" && exp.productId) {
        const pid = exp.productId.toString();
        if (productWiseExpenses[pid]) {
          productWiseExpenses[pid].cogs += exp.amountPaid;
        }
      }
    });

    const totalProducts = typedProducts.length;

    const marketingPerProduct = totalExpenses.marketing / totalProducts;
    const fixedPerProduct = totalExpenses.fixedOpex / totalProducts;
    const variablePerProduct = totalExpenses.variable / totalProducts;

    Object.keys(productWiseExpenses).forEach((pid) => {
      productWiseExpenses[pid].marketing = marketingPerProduct;
      productWiseExpenses[pid].fixedOpex = fixedPerProduct;
      productWiseExpenses[pid].variable = variablePerProduct;
    });

    return res.status(200).json({
        success: true,
        data: {
          inventory: {
            productWiseInventory,
            totalInventoryValue,
          },
          alerts: {
            inventory: {
              expiryAlerts,
            },
          },
          expenses: {
            totalExpensesAmount,
            totalExpenses,
            productWiseExpenses
          }
        },
      });
  } catch (error) {
    console.error("Insight API ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
}