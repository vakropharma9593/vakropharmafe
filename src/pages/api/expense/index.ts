import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import Expense from "@/models/Expense";
import { ExpenseCategoryType } from "@/lib/utils";
import { Types } from "mongoose";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();

    // CREATE Expense
    if (req.method === "POST") {
      const { voucher, paidTo, purpose, expenseCategory, productId, amountPaid, paidBy, paymentDate, paymentMode, authorizedByDirector, isSettled, settlementDate = "" } = req.body;
      let finalDataToSave: {
        voucher: string,
        paidTo: string,
        purpose: string,
        expenseCategory:  ExpenseCategoryType,
        amountPaid: number,
        paidBy: string,
        paymentDate: Date,
        paymentMode: string,
        authorizedByDirector: boolean,
        isSettled: boolean,
        settlementDate: Date,
        productId?: Types.ObjectId,
      } = {
        voucher,
        paidTo,
        purpose,
        expenseCategory,
        amountPaid,
        paidBy,
        paymentDate,
        paymentMode,
        authorizedByDirector,
        isSettled,
        settlementDate,
      }
      if (expenseCategory === ExpenseCategoryType.COGS) {
        finalDataToSave = {
          ...finalDataToSave,
          productId: productId
        }
      }
      // 5️⃣ Save Expense
      const expense = await Expense.create(finalDataToSave);

      return res.status(201).json({
        success: true,
        data: expense,
      });
    }

    // GET Expenses
    if (req.method === "GET") {
      console.info("asdfas");
        const inventory = await Expense.find().lean();
      
        return res.status(200).json({
            success: true,
            data: inventory,
        });
    }

    res.status(405).json({ message: "Method Not Allowed" });

  } catch (error) {
    console.error("EXPENSE API ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
}