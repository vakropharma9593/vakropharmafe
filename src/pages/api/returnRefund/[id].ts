import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import ReturnRefund, { ReturnRefundStatusType } from "@/models/ReturnRefund";
import Inventory from "@/models/Inventory";
import "@/models/Order";
import Product from "@/models/Product";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();

    if (req.method === "PATCH") {
      const { id } = req.query;
      const { status } = req.body;

      const existing = await ReturnRefund.findById(id);

        if (!existing) {
            return res.status(404).json({
            success: false,
            message: "ReturnRefund not found",
            });
        }

      const returnRefund = await ReturnRefund.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      )
      .populate({
        path: "orderId",
        select: "products",
      })
      .lean();
      

      const alreadyProcessed = existing.status === ReturnRefundStatusType.PACKAGE_RECEIVED;


      if (status === ReturnRefundStatusType.PACKAGE_RECEIVED && !alreadyProcessed) {
        await Promise.all(
            returnRefund.orderId.products.map(async (product: { batchId: string, quantity: number }) => {
                const inventory = await Inventory.findById(product.batchId);

                if (!inventory) {
                    throw new Error(
                        `Inventory not found for batch ${product.batchId}`
                    );
                }

                const existingProduct = await Product.findById(inventory.productId);
                existingProduct.currentQuantity += product.quantity;
                await existingProduct.save();

                inventory.remainingCount += product.quantity;
                await inventory.save();
            })
        );
      }

      return res.status(200).json({
        success: true,
        data: returnRefund
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