import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import ContactUs from "@/models/ContactUs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();

  if (req.method === "POST") {
    try {
      const { name, phone, email, message } = req.body;

      if (!name || !phone || !email || !message) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }

      const contact = await ContactUs.create({
        name,
        phone,
        email,
        message,
      });

      return res.status(201).json({
        success: true,
        data: contact,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }

  if (req.method === "GET") {
    try {
      const contacts = await ContactUs.find().sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        data: contacts,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}