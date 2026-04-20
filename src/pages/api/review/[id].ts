import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Review from "@/models/Review";
import Product from "@/models/Product";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();

  // =========================
  // ✅ UPDATE REVIEW
  // =========================
  if (req.method === "PATCH") {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { id } = req.query;
      const { isVerifiedUser } = req.body;

      const existing = await Review.findById(id).session(session);
      if (!existing) {
        throw new Error("Review not found");
      }

      const alreadyVerified = existing.isVerifiedUser;
      if (alreadyVerified) {
        return res.status(200).json({
            success: true,
            message: "Already marked verified."
        });
      }

      const updated = await Review.findByIdAndUpdate(
        id,
        { isVerifiedUser },
        { new: true, session }
      );

      await session.commitTransaction();
      session.endSession();

      return res.status(200).json({
        success: true,
        data: updated,
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      return res.status(500).json({
        success: false,
        message: "Failed to update review",
      });
    }
  }

  // =========================
  // ✅ DELETE REVIEW
  // =========================
  if (req.method === "DELETE") {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { id } = req.query;

      const review = await Review.findById(id).session(session);
      if (!review) {
        throw new Error("Review not found");
      }

      const product = await Product.findById(
        review.productId
      ).session(session);

      if (!product) {
        throw new Error("Product not found");
      }

      const rounded = Math.floor(review.rating);

      product.ratingBreakdown[rounded] -= 1;

      const newTotal = product.totalReviews - 1;

      if (newTotal === 0) {
        product.totalReviews = 0;
        product.averageRating = 0;
      } else {
        const totalRating =
          product.averageRating * product.totalReviews - review.rating;

        product.totalReviews = newTotal;
        product.averageRating = Number(
          (totalRating / newTotal).toFixed(1)
        );
      }

      await product.save({ session });

      await review.deleteOne({ session });

      await session.commitTransaction();
      session.endSession();

      return res.status(200).json({
        success: true,
        message: "Review deleted successfully",
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      return res.status(500).json({
        success: false,
        message: error ?? "Failed to delete review",
      });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}