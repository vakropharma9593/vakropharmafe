import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import Expense from "@/models/Expense";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();

    // CREATE Expense
    if (req.method === "POST") {
      const { voucher, paidTo, purpose, expenseCategory, productId, amountPaid, paidBy, paymentDate, paymentMode, authorizedByDirector, isSettled, settlementDate = "" } = req.body;

      // 5️⃣ Save Expense
      const expense = await Expense.create({
        voucher,
        paidTo,
        purpose,
        expenseCategory,
        productId,
        amountPaid,
        paidBy,
        paymentDate,
        paymentMode,
        authorizedByDirector,
        isSettled,
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