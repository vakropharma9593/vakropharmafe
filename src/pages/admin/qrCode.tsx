"use client";

import { useEffect, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import styles from "../../styles/qrCode.module.css";
import vakroLogo from "../../../public/assets/goldenLogo.svg";
import AdminNavbar from "@/components/AdminNavbar";

type QRCodeInstance = {
  update: (options: { data: string }) => void;
  append: (el: HTMLElement) => void;
  download: (options: { name: string; extension: "png" | "svg" }) => void;
};

const QRCodeGenerator = () => {
  const qrRef = useRef<QRCodeInstance | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [inputUrl, setInputUrl] = useState("");
  const [qrUrl, setQrUrl] = useState("https://www.vakropharma.com");

  // Initialize QR once
  useEffect(() => {
    const qr = new QRCodeStyling({
      width: 280,
      height: 280,
      data: qrUrl,
      image: vakroLogo.src, // ✅ FIXED

      dotsOptions: {
        color: "#173F36",
        type: "rounded",
      },

      backgroundOptions: {
        color: "#F4EFE7",
      },

      imageOptions: {
        crossOrigin: "anonymous",
        margin: 6,
        imageSize: 0.22,
      },

      cornersSquareOptions: {
        type: "extra-rounded",
        color: "#C9A25E",
      },

      cornersDotOptions: {
        type: "dot",
        color: "#C9A25E",
      },
    });

    qrRef.current = qr;

    if (containerRef.current) {
      qr.append(containerRef.current);
    }
  }, []);

  // Update QR only when user clicks generate
  useEffect(() => {
    qrRef.current?.update({ data: qrUrl });
  }, [qrUrl]);

  const handleGenerate = () => {
    if (!inputUrl) return;
    setQrUrl(inputUrl);
  };

  const download = (ext: "png") => {
    qrRef.current?.download({
      name: "vakro-qr",
      extension: ext,
    });
  };

  const downloadHD = () => {
    const highResQR = new QRCodeStyling({
      width: 1000,
      height: 1000,
      data: qrUrl,
      image: vakroLogo.src, // ✅ FIXED

      dotsOptions: {
        color: "#173F36",
        type: "rounded",
      },

      backgroundOptions: {
        color: "#FFFFFF",
      },

      imageOptions: {
        crossOrigin: "anonymous",
        margin: 8,
        imageSize: 0.22,
      },

      cornersSquareOptions: {
        type: "extra-rounded",
        color: "#C9A25E",
      },

      cornersDotOptions: {
        type: "dot",
        color: "#C9A25E",
      },
    });

    highResQR.download({
      name: "vakro-qr-print",
      extension: "png",
    });
  };

  return (
    <div>
        <AdminNavbar />
        <div className={styles.page}>
        <div className={styles.card}>
            <h2 className={styles.heading}>QR Code Generator</h2>

            <input
            className={styles.input}
            placeholder="Enter your link..."
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            />

            {/* ✅ Generate Button */}
            <button className={styles.primaryButton} onClick={handleGenerate}>
            Generate QR
            </button>

            <div ref={containerRef} style={{ marginTop: 20 }} />

            <p>Scanning this opens: {qrUrl}</p>

            <div className={styles.buttonGroup}>
            <button onClick={() => download("png")} className={styles.secondaryBtn}>
                Download PNG
            </button>

            <button onClick={downloadHD} className={styles.goldBtn}>
                Print HD
            </button>
            </div>
        </div>
        </div>
    </div>
  );
};

export default QRCodeGenerator;