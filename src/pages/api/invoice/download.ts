import type { NextApiRequest, NextApiResponse } from "next";
import PDFDocument from "pdfkit";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { generateInvoiceToken } from "@/lib/invoiceUtil";
import { CustomerType, PaymentStatusType } from "@/lib/utils";
import path from "path";
import fs from "fs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id, t } = req.query;

    const orderId = Array.isArray(id) ? id[0] : id;

    if (!orderId || !t) {
      return res.status(400).json({
        success: false,
        message: "Order ID and token is required",
      });
    }

    // 🔐 Verify token
    const expectedToken = generateInvoiceToken(orderId);
     if (t !== expectedToken) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized access",
        });
      }

    await connectDB();

    const order = await Order.findById(orderId).populate("products.productId", "name mrp").populate("customerId", "name phone type gst");

    if (!order) {
      return res.status(404).json({ success: false });
    }

    // 🔥 Create PDF
    const doc = new PDFDocument({
      size: "A4",
      margin: 40,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${orderId}.pdf`
    );

    doc.pipe(res);

    // 🔥 FONT (fix ₹ issue)
    const fontPath = path.join(process.cwd(), "public/fonts/NotoSans-Italic-VariableFont_wdth,wght.ttf");
    const boldFontPath = path.join(process.cwd(), "public/fonts/static/NotoSans_Condensed-Bold.ttf");
    const extraBoldFontPath = path.join(process.cwd(), "public/fonts/static/NotoSans_Condensed-ExtraBold.ttf");
    doc.font(fontPath);

    // 🔥 LOGO
    const logoPath = path.join(process.cwd(), "public/assets/vakroGreenLogo.png");

    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 40, 40, { width: 40 });
    }

    // 🔥 BRAND
    doc
      .fontSize(18)
      .text("Vakro Pharma", 90, 45)
      .fontSize(10)
      .text("Piragi, Bijnor, UP", 90, 65);

    // 🔥 INVOICE TITLE
    doc
      .fontSize(16)
      .text("INVOICE", 400, 45, { align: "right" })
      .fontSize(10)
      .text("GSTIN: jlajsfla08384", 400, 65, { align: "right" });

    doc.moveDown(2);

    // 🔥 CUSTOMER INFO
    doc
      .fontSize(11)
      .text(`Customer: ${order.customerId.name}`, { align: "right" })
      .text(`Phone: ${order.customerId.phone}`, { align: "right" });

    if (order.customerId?.gst) {
      doc.text(`GST: ${order.customerId.gst}`, { align: "right" });
    }

    doc.text(`Date: ${new Date(order.date).toLocaleDateString()}`, { align: "right" });

    doc.moveDown(1);

    // 🔥 WATERMARK
    doc.save();
    doc.rotate(-30, { origin: [300, 400] });

    doc
      .fontSize(80)
      .fillColor("#cccccc")
      .opacity(0.2)
      .text(
        order.paymentStatus === PaymentStatusType.PAYMENT_PENDING
          ? "PENDING"
          : "PAID",
        100,
        300,
        { align: "center" }
      );

    doc.restore();
    doc.opacity(1);
    doc.fillColor("#000");

    // 🔥 TABLE HEADER
    const tableTop = 200;

    const col = {
      item: 40,
      qty: 220,
      free: 260,
      mrp: 310,
      amt: 380,
      gst: 460,
    };

    doc
      .fontSize(11)
      .text("Item", col.item, tableTop)
      .text("Qty", col.qty, tableTop);

    if (order.customerId?.type === CustomerType.WHOLE_SALE) {
      doc.text("Free", col.free, tableTop);
    }

    doc
      .text("MRP", col.mrp, tableTop)
      .text("Amt", col.amt, tableTop);

    if (order.customerId?.gst) {
      doc.text("GST", col.gst, tableTop);
    }

    // 🔥 LINE
    doc.moveTo(40, tableTop + 15).lineTo(550, tableTop + 15).stroke();

    // 🔥 TABLE ROWS
    let y = tableTop + 30;

    order.products.forEach((p: { totalPrice: number, sellingPrice: number, quantity: number, freeQuantity: number, productId: { name: string, mrp: number} }) => {
      doc
        .fontSize(10)
        .text(p.productId.name, col.item, y)
        .text(p.quantity.toString(), col.qty, y);

      if (order.customerId?.type === CustomerType.WHOLE_SALE) {
        doc.text(p.freeQuantity?.toString() || "0", col.free, y);
      }

      doc
        .text(`₹${p.productId.mrp}`, col.mrp, y)
        .text(
          `₹${
            order.customerId?.gst
              ? p.sellingPrice
              : p.totalPrice
          }`,
          col.amt,
          y
        );

      if (order.customerId?.gst) {
        doc.text(
          `₹${(p.totalPrice - p.sellingPrice).toFixed(2)}`,
          col.gst,
          y
        );
      }

      y += 25;
    });
    // 🔥 SubTOTAL LINE
    doc.moveTo(40, y).lineTo(550, y).stroke();

    y += 10;

    doc
      .fontSize(12)
      .text("Sub Total:", 250, y)
      .font(fontPath)
      .text(`₹${(order.products?.reduce((sum: number, item: { sellingPrice: number, totalPrice: number, quantity: number }) => {
        const amountToAdd = order.customerId?.gst ? item?.sellingPrice : item?.totalPrice;
        const finalSum = sum + (amountToAdd*item.quantity);
        return finalSum;
      },0)).toFixed(2)}`, 370, y);
      if(order.customerId?.gst) {
        doc.text(`₹${(order.products.reduce((sum: number, item: { sellingPrice: number, totalPrice: number, quantity: number }) => {
            const finalSum = sum + ((item?.totalPrice - item?.sellingPrice)*item?.quantity);
            return finalSum;
        },0)).toFixed(2)}`, 440, y);
      }

    y += 25;
      
    // 🔥 TOTAL LINE
    doc.moveTo(40, y).lineTo(550, y).stroke();

    y += 10;

    doc
      .fontSize(12)
      .text("Grand Total:", 250, y)
      .font(boldFontPath)
      .text(`₹${order.totalAmount}`, 370, y);

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
}