import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import Review from "@/models/Review";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();

    if (req.method === "PATCH") {
      const { id } = req.query;
      const { isVerifiedUser } = req.body;

      const existing = await Review.findById(id);
      if (!existing) {
          return res.status(404).json({
          success: false,
          message: "Review not found",
          });
      }
            
      
      const alreadyVerified = existing.isVerifiedUser;
      if (alreadyVerified) {
        return res.status(200).json({
            success: true,
            message: "Already marked verified."
        });
      } else {
        const review = await Review.findByIdAndUpdate(
            id,
            { isVerifiedUser },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            data: review
        });
      }
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