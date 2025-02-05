"use client";

import { OurFileRouter } from "@/app/api/uploadthing/core";
import { UploadDropzone } from "@uploadthing/react";

interface UploadButtonProps {
  endpoint: keyof OurFileRouter;
  onClientUploadComplete?: (res: { url: string }[]) => void;
  onUploadError?: (error: Error) => void;
}

export function UploadButton({ 
  endpoint, 
  onClientUploadComplete, 
  onUploadError 
}: UploadButtonProps) {
  return (
    <UploadDropzone<OurFileRouter, "stlFile">
      endpoint={endpoint}
      onClientUploadComplete={onClientUploadComplete}
      onUploadError={onUploadError}
      className="ut-button:bg-neutral-100 ut-button:text-neutral-900 ut-button:hover:bg-neutral-200 ut-button:h-8 ut-button:px-3 ut-button:py-1.5 ut-button:text-xs ut-button:font-medium ut-label:text-neutral-400 ut-label:text-xs"
    />
  );
} 