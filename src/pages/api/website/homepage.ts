import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { HomepageProduct } from "@/lib/utils";

let cachedData: HomepageProduct[] | null = null;
let lastFetchTime = 0;

const CACHE_TTL = 60 * 1000; // 60 sec

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if (req.method !== "GET") {
        return res.status(405).json({ success: false });
    }
    try {
        const now = Date.now();

        if (cachedData && now - lastFetchTime < CACHE_TTL) {
            return res.status(200).json({
                success: true,
                data: cachedData,
                source: "memory-cache",
            });
        }

        await connectDB();

        const products: HomepageProduct[] = await Product.find(
            { isActive: true },
            "name mrp slug isActive averageRating totalReviews ratingBreakdown currentQuantity"
            )
            .sort({ createdAt: -1 })
            .limit(50)
            .lean();

        cachedData = products;
        lastFetchTime = now;
        res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=120");

        return res.status(200).json({
            success: true,
            data: products,
            source: "db",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error ?? "Failed to create review",
        });
    }
}