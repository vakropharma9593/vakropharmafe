import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Inventory from "@/models/Inventory";
import { Types } from "mongoose";
import Expense from "@/models/Expense";
import { ExpenseCategoryType, OrderStatusType, PaymentStatusType } from "@/lib/utils";
import Payment from "@/models/Payment";
import Order from "@/models/Order";
import ReturnRefund from "@/models/ReturnRefund";

/** =========================
 * TYPES
 ========================== */

type BatchInfo = {
  batch: string;
  totalCount: number;
  remainingCount: number;
  inventoryValue: number;
  expiryDate: Date;
  isExpiringSoon: boolean;
  isLowStock: boolean;
};

type ProductInventory = {
  batches: BatchInfo[];
  totalInventoryValue: number;
  totalRemaining: number;
  totalSoldUnits: number;
  totalUnits: number;
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
      orders,
      payments,
      returnRefunds
    ] = await Promise.all([
      Inventory.find()
        .populate({
            path: "productId",
            select: "name costPrice gstPercentageOnCostPrice",
        })
        .lean(),
      Product.find().lean(),
      Expense.find().lean(),
      Order.find()
        .populate("products.productId", "name costPrice gstPercentageOnCostPrice gstPercentage")
        .lean(),
      Payment.find().lean(),
      ReturnRefund.find().lean()
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

    let totalGstPaidInCP = 0;

    for (const inv of inventories) {
        const productId = inv.productId?._id;
        const costPrice = inv.productId?.costPrice || 0;

        if (!productId) continue;

        totalGstPaidInCP += inv.productId?.gstPercentageOnCostPrice * inv.remainingCount;
        const inventoryValue = inv.remainingCount * costPrice;

        // Initialize product bucket
        if (!productWiseInventory[productId]) {
            productWiseInventory[productId] = {
              batches: [],
              totalInventoryValue: 0,
              totalRemaining: 0,
              totalSoldUnits: 0,
              totalUnits: 0,
            };
        }

        // Push batch data
        productWiseInventory[productId].batches.push({
            batch: inv.batch,
            totalCount: inv.totalCount,
            remainingCount: inv.remainingCount,
            inventoryValue,
            expiryDate: inv.expiryDate,
            isExpiringSoon: new Date(inv.expiryDate).getTime() - today.getTime() <= THIRTY_DAYS,
            isLowStock: inv.remainingCount < inv.totalCount * 0.2,
        });

        // Aggregate per product
        productWiseInventory[productId].totalInventoryValue += inventoryValue;
        productWiseInventory[productId].totalRemaining += inv.remainingCount;
        const soldUnits = inv.totalCount - inv.remainingCount;
        productWiseInventory[productId].totalSoldUnits += soldUnits;
        productWiseInventory[productId].totalUnits += inv.totalCount;

        // Aggregate overall
        totalInventoryValue += inventoryValue;
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
      productWiseExpenses[pid].marketing = Number(marketingPerProduct.toFixed(2));
      productWiseExpenses[pid].fixedOpex = Number(fixedPerProduct.toFixed(2));
      productWiseExpenses[pid].variable = Number(variablePerProduct.toFixed(2));
    });

    /** =========================
     * Orders metrics
    ========================== */
    const ordersCount = orders?.length;

    const productWiseSales: Record<string, { unitCount: number, productName: string, totalSale: number, netSale: number, cogs: number, cm1: number, cm2: number, cm3: number, finalProfit: number, gstPaidInCP: number, gstCollected: number }> = {};
    
    Object.keys(productMap)?.forEach((id: string) => {
      productWiseSales[id] = {
        unitCount: 0,
        productName: productMap[id].name,
        totalSale: 0,
        netSale: 0,
        cogs: 0,
        cm1: 0,
        cm2: 0,
        cm3: 0,
        finalProfit: 0,
        gstPaidInCP: 0,
        gstCollected: 0,
      }
    })

    let unPaidOrders = 0;
    let deliveredOrders = 0;
    let paidOrders = 0;
    let preparingOrders = 0;
    let dispatchedOrders = 0;

    let gstPaidInCPForOrders = 0;
    let gstToBePaidForOrders = 0;

    orders.forEach((order) => {
      switch (order.status) {
        case OrderStatusType.PREPARING:
          preparingOrders += 1;
          break;
        case OrderStatusType.DISPATCHED:
          dispatchedOrders += 1;
          break;
        case OrderStatusType.DELIVERED:
          deliveredOrders += 1;
          break;
        default:
          break;
      }

      switch (order.paymentStatus) {
        case PaymentStatusType.PAYMENT_PENDING:
          unPaidOrders += 1;
          break;
        case PaymentStatusType.PAYMENT_DONE:
          paidOrders += 1;
          break;
        default:
          break;
      }
      if (order.paymentStatus === PaymentStatusType.PAYMENT_DONE) {
        order.products?.map((product: { totalPrice: number, sellingPrice: number, quantity: number, productId: { name: string, _id: Types.ObjectId, costPrice: number, gstPercentage: number, gstPercentageOnCostPrice: number } }) => {
          const totalSale = productWiseSales[product.productId._id.toString()].totalSale + product.totalPrice * product.quantity;
          const netSale = productWiseSales[product.productId._id.toString()].netSale + product.sellingPrice * product.quantity;
          const cogs = (productWiseExpenses[product.productId._id.toString()].cogs / productWiseInventory[product.productId._id.toString()].totalUnits)* product.quantity;
          const unitCount = productWiseSales[product.productId._id.toString()].unitCount + product.quantity;
          const gstAmount = (product.totalPrice - product.sellingPrice)*product.quantity;
          const gstCP = ((product.productId.costPrice*product.productId.gstPercentageOnCostPrice)/(100 + product.productId.gstPercentageOnCostPrice))*product.quantity;
          gstPaidInCPForOrders += gstCP;
          gstToBePaidForOrders += gstAmount;
          const gstCollected = productWiseSales[product.productId._id.toString()].gstCollected + gstAmount;
          const gstPaidInCP = productWiseSales[product.productId._id.toString()].gstPaidInCP + gstCP;
          // console.info("aa", gstAmount, product.totalPrice, product.sellingPrice, product.quantity);
      
          productWiseSales[product.productId._id.toString()] = {
            ...productWiseSales[product.productId._id.toString()],
            totalSale: Number(totalSale.toFixed(2)),
            netSale: Number(netSale.toFixed(2)),
            cogs: Number(cogs.toFixed(2)),
            gstCollected: Number(gstCollected.toFixed(2)),
            gstPaidInCP: Number(gstPaidInCP.toFixed(2)),
            unitCount,
          }
        })
      }
    });


    const totalAmountReceived = payments?.reduce((sum: number, item: { totalAmount: number }) => {
      sum += item.totalAmount;
      return sum;
    },0);

    let totalAmountReturned = 0
    if (returnRefunds?.length > 0) {
      totalAmountReturned = returnRefunds?.reduce((sum: number, item: { amountPaidBack: number }) => {
        sum += item.amountPaidBack;
        return sum;
      });
    }

    const totalRevenue = Number((totalAmountReceived - totalAmountReturned).toFixed(2));
    let totalUnitsSold = 0;

    Object.keys(productWiseSales)?.forEach((id: string) => {
      const cm1 = productWiseSales[id].netSale - productWiseSales[id].cogs;
      const cm2 = cm1 - (productWiseSales[id].totalSale/totalRevenue)*totalExpenses.variable;
      const cm3 = cm2 - (productWiseSales[id].totalSale/totalRevenue)*totalExpenses.marketing;
      const finalProfit = cm3 - (productWiseSales[id].totalSale/totalRevenue)*totalExpenses.fixedOpex;
      productWiseSales[id] = {
        ...productWiseSales[id],
        cm1: Number(cm1.toFixed(2)),
        cm2: Number(cm2.toFixed(2)),
        cm3: Number(cm3.toFixed(2)),
        finalProfit: Number(finalProfit.toFixed(2)),
      };
      totalUnitsSold += productWiseSales[id].unitCount;
    });

    //overall sales
    let netRevenue = 0;
    let cm1 = 0;
    let cm2 = 0;
    let cm3 = 0;
    let finalProfit = 0;

    Object.keys(productWiseSales)?.forEach((id: string) => {
      netRevenue += productWiseSales[id].netSale;
      cm1 += productWiseSales[id].cm1;
    })

    cm2 = cm1 - totalExpenses.variable;
    cm3 = cm2 - totalExpenses.marketing
    finalProfit = cm3 - totalExpenses.fixedOpex;

    //unit economics
    const aov = Number((totalRevenue / ordersCount).toFixed(2));
    const cac = Number((totalExpenses.marketing/ordersCount).toFixed(2));
    const unitsPerOrder = Number((totalUnitsSold/ordersCount).toFixed(2));

    const unitEconomics = {
      totalRevenue: aov,
      netRevenue: Number((netRevenue / ordersCount).toFixed(2)),
      cm1: {
        value: Number((cm1/ordersCount).toFixed(2)),
        percentage: Number(((cm1/netRevenue)*100).toFixed(2)),
      },
      cm2: {
        value: Number((cm2/ordersCount).toFixed(2)),
        percentage: Number(((cm2/netRevenue)*100).toFixed(2)),
      },
      cm3: {
        value: Number((cm3/ordersCount).toFixed(2)),
        percentage: Number(((cm3/netRevenue)*100).toFixed(2)),
      },
      finalProfit: {
        value: Number((finalProfit/ordersCount).toFixed(2)),
        percentage: Number(((finalProfit/netRevenue)*100).toFixed(2)),
      }
    }

    const productWiseData: Record<string, {
      inventory: {
        batches: BatchInfo[],
        totalInventoryValue: number,
        totalRemaining: number,
        totalSoldUnits: number,
        totalUnits: number,
      }
      name: string,
      expense: {
        cogs: number,
        fixedOpex: number,
        marketing: number,
        variable: number,
      },
      sales: {
        unitCount: number,
        totalSale: number,
        netSale: number,
        cogs: number,
        cm1: number,
        cm2: number,
        cm3: number,
        finalProfit: number,
        gstPaidInCP: number,
        gstCollected: number,
      }}> = {};

    typedProducts.forEach((p) => {
      productWiseData[p._id.toString()] = {
        inventory: productWiseInventory[p._id.toString()],
        name: productWiseExpenses[p._id.toString()].name,
        expense: productWiseExpenses[p._id.toString()],
        sales: productWiseSales[p._id.toString()],
      };
    });

    return res.status(200).json({
        success: true,
        data: {
          productWiseData,
          inventory: {
            totalInventoryValue,
          },
          expenses: {
            totalExpensesAmount,
            totalExpenses,
          },
          revenues: {
              totalRevenue,
              netRevenue: Number(netRevenue.toFixed(2)),
              cm1: Number(cm1.toFixed(2)),
              cm2: Number(cm2.toFixed(2)),
              cm3: Number(cm3.toFixed(2)),
              finalProfit: Number(finalProfit.toFixed(2)),
              totalGstPaidInCP: Number(totalGstPaidInCP.toFixed(2)),
          },
          totalOrders: ordersCount,
          gstPaidInCPForOrders: Number(gstPaidInCPForOrders.toFixed(2)),
          gstToBePaidForOrders: Number(gstToBePaidForOrders.toFixed(2)),
          unitEconomics,
          cac,
          unitsPerOrder,
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