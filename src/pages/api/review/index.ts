import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import Review from "@/models/Review";
import "@/models/Product";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();

    // CREATE ORDER
    if (req.method === "POST") {
      const { productId, review, rating, reviewerName, skinType, skinConcern, email, phone  } = req.body;

       const finalReview = {
        productId: productId,
        reviewerName,
        skinType,
        skinConcern,
        rating,
        review,
        email,
        phone,
        isVerifiedUser: false
       };

      const reviewSaved = await Review.create(finalReview);

      return res.status(201).json({
        success: true,
        data: reviewSaved,
      });
    }

    // GET 
    if (req.method === "GET") {
      const { productId } = req.query;

      try {
        // 🔥 CASE 1: Get all reviews (no filter)
        if (!productId) {
          const reviews = await Review.find()
            .populate("productId", "name slug")
            .sort({ createdAt: -1 })
            .lean();

          return res.status(200).json({
            success: true,
            data: reviews,
          });
        }

        // 🔥 CASE 2: Get reviews by productId
        const reviews = await Review.find({ productId })
          .populate("productId", "name slug")
          .sort({ createdAt: -1 })
          .lean();

        const totalReviews = reviews.length;

        const totalRatings = reviews.reduce((sum, r) => sum + r.rating, 0);
        const averageRating =
          totalReviews > 0
            ? Number((totalRatings / totalReviews).toFixed(1))
            : 0;

        const ratingBreakdown: Record<number, number> = {
          5: 0,
          4: 0,
          3: 0,
          2: 0,
          1: 0,
        };

        reviews.forEach((r) => {
          const star = Math.floor(r.rating);
          if (ratingBreakdown[star] !== undefined) {
            ratingBreakdown[star]++;
          }
        });

        return res.status(200).json({
          success: true,
          data: {
            reviews,
            totalReviews,
            averageRating,
            ratingBreakdown,
          },
        });

      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Failed to fetch reviews",
        });
      }
    }

    res.status(405).json({ message: "Method Not Allowed" });

  } catch (error) {
    console.error("REVIEW API ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
}