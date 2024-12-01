"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ImageUpload() {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    setIsUploading(true);
    try {
      // TODO: Implement image upload logic
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-4">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          className="hidden"
          id="image-upload"
        />
        <label htmlFor="image-upload">
          <Button
            variant="outline"
            disabled={isUploading}
            className="cursor-pointer"
            asChild
          >
            <span>
              {isUploading ? "Uploading..." : "Upload Images"}
            </span>
          </Button>
        </label>
      </div>
    </Card>
  );
} 