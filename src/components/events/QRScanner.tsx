"use client";

import React, { useEffect, useRef, useState } from "react";
import { Camera, CameraOff, Keyboard, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export interface QRScannerProps {
  onScan: (token: string) => void;
  isScanningDisabled?: boolean;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScan, isScanningDisabled = false }) => {
  const [manualToken, setManualToken] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const scannerRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      // Cleanup camera scanner on unmount
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
      }
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const { Html5QrcodeScanner } = await import("html5-qrcode");

      if (scannerRef.current) {
        await scannerRef.current.clear();
      }

      const scanner = new Html5QrcodeScanner(
        "qr-reader-container",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          rememberLastUsedCamera: true,
        },
        false
      );

      scanner.render(
        (decodedText: string) => {
          if (!isScanningDisabled) {
            onScan(decodedText);
          }
        },
        (error: any) => {
          // Continuous scanning ticks, safely ignore frame-level noise
        }
      );

      scannerRef.current = scanner;
      setCameraActive(true);
    } catch (err: any) {
      console.warn("Camera start error:", err);
      setCameraError(
        "Camera access is unavailable or denied. Please use the manual ticket code entry below."
      );
      setCameraActive(false);
    }
  };

  const stopCamera = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.clear();
      } catch {}
      scannerRef.current = null;
    }
    setCameraActive(false);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualToken.trim()) return;
    onScan(manualToken.trim());
    setManualToken("");
  };

  return (
    <div className="space-y-4">
      {/* Camera Box */}
      <div className="bg-slate-900 rounded-lg p-4 text-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-campus-gold-400" />
            <span className="text-xs font-bold uppercase tracking-wider">Camera Barcode / QR Scanner</span>
          </div>

          <button
            type="button"
            onClick={cameraActive ? stopCamera : startCamera}
            className={`px-3 py-1 rounded text-xs font-semibold transition ${
              cameraActive ? "bg-rose-700 hover:bg-rose-800 text-white" : "bg-campus-gold-500 hover:bg-campus-gold-400 text-campus-navy-950"
            }`}
          >
            {cameraActive ? "Stop Camera" : "Launch Camera"}
          </button>
        </div>

        {cameraError && (
          <div className="mb-3 p-2.5 rounded bg-amber-950/80 border border-amber-800 text-amber-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>{cameraError}</span>
          </div>
        )}

        <div
          id="qr-reader-container"
          className={`w-full min-h-[220px] rounded border border-slate-700 flex items-center justify-center overflow-hidden bg-slate-950 ${
            cameraActive ? "block" : "hidden"
          }`}
        />

        {!cameraActive && (
          <div className="py-8 text-center text-xs text-slate-400 flex flex-col items-center justify-center">
            <CameraOff className="w-8 h-8 mb-2 text-slate-600" />
            <p>Camera is currently idle. Click &quot;Launch Camera&quot; to scan attendee QR passes.</p>
          </div>
        )}
      </div>

      {/* Manual Input Fallback */}
      <form onSubmit={handleManualSubmit} className="flex gap-2">
        <div className="flex-1">
          <Input
            value={manualToken}
            onChange={(e) => setManualToken(e.target.value)}
            placeholder="Or enter QR Token manually (e.g. CU-QR-evt-...)"
            className="text-xs"
          />
        </div>
        <Button variant="primary" size="md" type="submit" disabled={!manualToken.trim()}>
          <Keyboard className="w-4 h-4 mr-1.5" />
          <span>Verify Token</span>
        </Button>
      </form>
    </div>
  );
};
