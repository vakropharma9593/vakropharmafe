import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import Expense, { PurposeType } from "@/models/Expense";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();

    // CREATE Expense
    if (req.method === "POST") {
      const { voucher, paidTo, purpose, amountPaid, paidBy, paymentDate, paymentMode, authorizedByDirector, isSettled, settlementDate = "" } = req.body;
      const getExpenseCategory = (purpose: PurposeType): "Fixed" | "Variable" => {
        switch (purpose) {
          case PurposeType.SALARY:
          case PurposeType.RENT_ELECTRICITY:
            return "Fixed";

          case PurposeType.PRODUCT:
          case PurposeType.MARKETING:
          case PurposeType.OTHER:
          default:
            return "Variable";
        }
      };

      // 5️⃣ Save Expense
      const expense = await Expense.create({
        voucher,
        paidTo,
        purpose,
        amountPaid,
        paidBy,
        paymentDate,
        paymentMode,
        authorizedByDirector,
        isSettled,
        expenseCategory: getExpenseCategory(purpose),
        settlementDate,
      });

      return res.status(201).json({
        success: true,
        data: expense,
      });
    }

    // GET Expenses
    if (req.method === "GET") {
        const inventory = await Expense.find().sort({ createdAt: -1 });
      
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