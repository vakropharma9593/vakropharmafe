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
  // ✅ CREATE REVIEW (SAFE)
  // =========================
  if (req.method === "POST") {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const {
        productId,
        review,
        rating,
        reviewerName,
        skinType,
        skinConcern,
        email,
        phone,
      } = req.body;

      if (email) {
        // 🚫 Prevent multiple reviews per user (email + product)
        const existingReview = await Review.findOne({
          productId,
          email,
        }).session(session);

        if (existingReview) {
          await session.abortTransaction();
          session.endSession();

          return res.status(400).json({
            success: false,
            message: "You have already reviewed this product",
          });
        }
      }

      // ✅ Create Review
      const reviewDoc = await Review.create(
        [
          {
            productId,
            review,
            rating,
            reviewerName,
            skinType,
            skinConcern,
            email,
            phone,
            isVerifiedUser: false,
          },
        ],
        { session }
      );

      const product = await Product.findById(productId).session(session);

      if (!product) {
        throw new Error("Product not found");
      }

      const rounded = Math.floor(rating);

      // ✅ Update breakdown
      product.ratingBreakdown[rounded] += 1;

      // ✅ Update average
      const newTotal = product.totalReviews + 1;
      const newAvg =
        (product.averageRating * product.totalReviews + rating) / newTotal;

      product.totalReviews = newTotal;
      product.averageRating = Number(newAvg.toFixed(1));

      await product.save({ session });

      await session.commitTransaction();
      session.endSession();

      return res.status(201).json({
        success: true,
        data: reviewDoc[0],
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      return res.status(500).json({
        success: false,
        message: "Failed to create review",
      });
    }
  }

  // =========================
  // ✅ GET REVIEWS (PAGINATED)
  // =========================
  if (req.method === "GET") {
    try {
      const { productId, page = "1", limit = "10" } = req.query;

      const pageNumber = Math.max(parseInt(page as string, 10), 1);
      const pageSize = Math.max(parseInt(limit as string, 10), 1);
      const skip = (pageNumber - 1) * pageSize;

      const query: Record<string, unknown> = productId ? { productId } : {};

      const [reviews, total, product, bestReview] = await Promise.all([
        Review.find(query)
          .populate(
            "productId",
            "name slug"
          )
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(pageSize)
          .lean(),
        Review.countDocuments(query),
        productId ? Product.findById(productId).lean() : null,
        productId
            ? Review.findOne({ productId })
                .sort({ rating: -1, createdAt: -1 })
                .lean()
            : null,
      ]);

      return res.status(200).json({
        success: true,
        data: reviews,
        bestReview,
        productStats: product
          ? {
              averageRating: product.averageRating || 0,
              totalReviews: product.totalReviews || 0,
              ratingBreakdown: product.ratingBreakdown || {},
            }
          : null,
        pagination: {
          total,
          page: pageNumber,
          limit: pageSize,
          totalPages: Math.ceil(total / pageSize),
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch reviews",
      });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}