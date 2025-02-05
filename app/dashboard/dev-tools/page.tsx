"use client";

import { Card } from "@/components/ui/card";
import { UploadButton } from "@/components/uploadthing";
import { useState } from "react";
import { FaUpload } from "react-icons/fa";

export default function DevToolsPage() {
  const [stlUrl, setStlUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleViewSTL = async () => {
    if (!stlUrl) return;
    
    try {
      setLoading(true);
      // First try to get a preview image
      const response = await fetch(`/api/infra/images?url=${encodeURIComponent(stlUrl)}`);
      const data = await response.json();
      
      if (data.success) {
        setPreviewUrl(data.data);
      }
      
      // Also open the 3D viewer in a new tab
      window.open(`https://www.viewstl.com/?url=${encodeURIComponent(stlUrl)}`, '_blank');
    } catch (error) {
      console.error('Failed to generate preview:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto grid gap-3 px-3 pb-3">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold leading-none">Dev Tools</h1>
      </div>

      <Card className="p-4">
        <h2 className="text-sm font-medium mb-4">STL Viewer</h2>
        <div className="space-y-4">
          <div className="flex flex-col gap-4">
            {/* Upload Section */}
            <div className="border border-dashed border-neutral-800/50 rounded-md p-4">
              <h3 className="text-xs font-medium mb-2">1. Upload STL File</h3>
              <UploadButton
                endpoint="stlFile"
                onClientUploadComplete={(res) => {
                  if (res?.[0]?.url) {
                    setStlUrl(res[0].url);
                  }
                }}
                onUploadError={(error: Error) => {
                  console.error('Upload error:', error);
                }}
              />
            </div>

            {/* URL Input Section */}
            <div>
              <h3 className="text-xs font-medium mb-2">2. Or Enter STL URL</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={stlUrl}
                  onChange={(e) => setStlUrl(e.target.value)}
                  placeholder="Enter STL URL"
                  className="flex-1 h-8 px-2 bg-transparent border rounded-md border-neutral-800/50 text-sm"
                />
                <button
                  onClick={handleViewSTL}
                  disabled={loading || !stlUrl}
                  className={`px-3 py-1.5 h-8 rounded-md text-xs font-medium inline-flex items-center gap-1.5 ${
                    loading
                      ? "bg-neutral-800 cursor-not-allowed"
                      : "bg-neutral-100 text-neutral-900 hover:bg-neutral-200"
                  }`}
                >
                  <FaUpload className="h-3 w-3" />
                  {loading ? "Processing..." : "Process STL"}
                </button>
              </div>
            </div>

            {/* Preview Section */}
            {previewUrl && (
              <div>
                <h3 className="text-xs font-medium mb-2">3. Preview Image</h3>
                <div className="relative group">
                  <img 
                    src={previewUrl} 
                    alt="STL Preview" 
                    className="max-w-[300px] rounded-md border border-neutral-800/50"
                  />
                  <a 
                    href={previewUrl}
                    download="stl-preview.png"
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm font-medium transition-opacity rounded-md"
                  >
                    Download Preview
                  </a>
                </div>
              </div>
            )}
          </div>
          
          <div className="text-xs text-neutral-400 pt-2 border-t border-neutral-800/50">
            <p>This tool allows you to:</p>
            <ul className="list-disc pl-4 mt-2 space-y-1">
              <li>Upload STL files directly</li>
              <li>Generate preview images</li>
              <li>View interactive 3D models</li>
              <li>Download preview images</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}