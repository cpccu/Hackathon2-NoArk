"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, File, Image, CheckCircle2, AlertCircle, X, Loader2 } from "lucide-react";
import { Button } from "./Button";

export interface UploadedFileResult {
  url: string;
  publicId: string;
  name: string;
  size: number;
  mimeType: string;
}

export interface FileUploaderProps {
  accept?: string;
  maxSizeMB?: number;
  folder?: string;
  onUploadComplete: (fileData: UploadedFileResult) => void;
  className?: string;
  label?: string;
  helperText?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  accept = ".pdf,.docx,.pptx,.png,.jpg,.jpeg,.webp",
  maxSizeMB = 10,
  folder = "campusos_uploads",
  onUploadComplete,
  className = "",
  label = "Upload File",
  helperText = "PDF, DOCX, PPTX, PNG, JPG up to 10MB",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<UploadedFileResult | null>(null);

  const handleFile = async (file: File) => {
    setError(null);

    // Client-side size check
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      setError(`File size exceeds limit of ${maxSizeMB} MB.`);
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "File upload failed.");
      }

      setUploadedFile(data);
      onUploadComplete(data);
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to upload file.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
          {label}
        </label>
      )}

      {error && (
        <div role="alert" className="mb-2.5 p-2.5 rounded bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {uploadedFile ? (
        <div className="flex items-center justify-between p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg">
          <div className="flex items-center space-x-3 truncate">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="truncate">
              <p className="text-xs font-semibold text-emerald-900 dark:text-emerald-200 truncate">
                {uploadedFile.name}
              </p>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                {(uploadedFile.size / 1024).toFixed(1)} KB • Upload complete
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="p-1 text-slate-400 hover:text-rose-600 rounded"
            aria-label="Remove uploaded file"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
            dragActive
              ? "border-campus-navy-700 bg-campus-navy-50/50 dark:border-campus-gold-400 dark:bg-campus-gold-950/20"
              : "border-slate-300 dark:border-slate-700 hover:border-campus-navy-500 bg-white dark:bg-slate-900"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleChange}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center">
            {uploading ? (
              <>
                <Loader2 className="w-8 h-8 text-campus-navy-800 dark:text-campus-gold-400 animate-spin mb-2" />
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Uploading and validating file...
                </p>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-campus-navy-50 dark:bg-slate-800 flex items-center justify-center text-campus-navy-700 dark:text-campus-gold-400 mb-2">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Click to browse or drag and drop
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{helperText}</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
