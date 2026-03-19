import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import Expense from "@/models/Expense";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();

    if (req.method === "PATCH") {
      const { id } = req.query;
      const { isSettled, settlementDate } = req.body;

      const expense = await Expense.findByIdAndUpdate(
        id,
        { isSettled, settlementDate },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        data: expense
      });
    }

    res.status(405).json({ message: "Method Not Allowed" });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
}