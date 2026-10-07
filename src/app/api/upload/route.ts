import { NextRequest, NextResponse } from "next/server";

// Allowed MIME types per PROJECT_SPEC Section 7.2 & 7.4
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-powerpoint",
  "image/png",
  "image/jpeg",
  "image/webp",
];

const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "campusos_uploads";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 1. MIME type validation
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: "Invalid file format. Allowed types: PDF, DOCX, PPTX, PNG, JPG, WEBP.",
        },
        { status: 400 }
      );
    }

    // 2. File size validation
    const isImage = file.type.startsWith("image/");
    const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_DOCUMENT_SIZE;

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: `File size exceeds the limit of ${maxSize / (1024 * 1024)} MB.`,
        },
        { status: 400 }
      );
    }

    // Cloudinary credentials
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // If Cloudinary is configured, upload to Cloudinary via REST API
    if (cloudName && apiKey && apiSecret) {
      const timestamp = Math.round(new Date().getTime() / 1000);
      const crypto = await import("crypto");
      const signaturePayload = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
      const signature = crypto.createHash("sha1").update(signaturePayload).digest("hex");

      const uploadForm = new FormData();
      const blob = new Blob([fileBuffer], { type: file.type });
      uploadForm.append("file", blob, file.name);
      uploadForm.append("api_key", apiKey);
      uploadForm.append("timestamp", timestamp.toString());
      uploadForm.append("signature", signature);
      uploadForm.append("folder", folder);

      const resourceType = isImage ? "image" : "raw";
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

      const response = await fetch(cloudinaryUrl, {
        method: "POST",
        body: uploadForm,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Cloudinary upload error:", errorData);
        throw new Error(errorData.error?.message || "Cloudinary upload failed");
      }

      const result = await response.json();
      return NextResponse.json({
        url: result.secure_url,
        publicId: result.public_id,
        name: file.name,
        size: file.size,
        mimeType: file.type,
      });
    }

    // Safe dev/demo fallback: Base64 data URL
    const base64Data = `data:${file.type};base64,${fileBuffer.toString("base64")}`;
    const mockPublicId = `campusos_demo_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    return NextResponse.json({
      url: base64Data,
      publicId: mockPublicId,
      name: file.name,
      size: file.size,
      mimeType: file.type,
      note: "Stored as data URI (configure CLOUDINARY_* in .env.local for production CDN).",
    });
  } catch (error: any) {
    console.error("Server upload error:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred during file upload." },
      { status: 500 }
    );
  }
}
