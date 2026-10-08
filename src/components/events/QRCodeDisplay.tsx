"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Loader2 } from "lucide-react";

export interface QRCodeDisplayProps {
  value: string;
  size?: number;
  className?: string;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  value,
  size = 200,
  className = "",
}) => {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(value, {
      width: size,
      margin: 1.5,
      color: {
        dark: "#0b1928", // campus-navy-900
        light: "#ffffff",
      },
    })
      .then((url) => {
        if (isMounted) setDataUrl(url);
      })
      .catch((err) => {
        console.error("QR Code Generation failed:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [value, size]);

  if (!dataUrl) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg ${className}`}
      >
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className={`p-2 bg-white rounded-lg shadow-sm border border-slate-200 inline-block ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={dataUrl}
        alt={`Campus-OS QR Ticket: ${value}`}
        width={size}
        height={size}
        className="rounded"
      />
    </div>
  );
};
