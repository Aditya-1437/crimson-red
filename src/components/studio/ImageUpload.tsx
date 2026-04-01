"use client";

import { useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  onRemove: () => void;
  currentImage?: string;
}

export default function ImageUpload({ onUpload, onRemove, currentImage }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await res.json();
      onUpload(data.url);
      toast.success("Image uploaded successfully!");
    } catch (error: any) {
      console.error(error);
      toast.error("Error uploading image: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  if (currentImage) {
    return (
      <div className="relative w-full h-48 rounded-3xl overflow-hidden group">
        <Image 
          src={currentImage} 
          alt="Cover preview" 
          fill 
          className="object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button 
            type="button"
            onClick={onRemove}
            className="flex items-center px-4 py-2 bg-white text-crimson font-bold rounded-full hover:bg-red-50 transition-colors shadow-lg"
          >
            <X size={16} className="mr-2" />
            Remove Cover
          </button>
        </div>
      </div>
    );
  }

  return (
    <label className="w-full h-48 border-2 border-dashed border-slate-300 rounded-3xl bg-white hover:bg-slate-50 hover:border-crimson/50 transition-colors flex flex-col items-center justify-center cursor-pointer group relative overflow-hidden focus-within:ring-2 focus-within:ring-crimson/20 focus-within:border-crimson outline-none">
      <input 
        type="file" 
        accept="image/*" 
        className="sr-only" 
        onChange={handleFileChange}
        disabled={isUploading}
      />
      {isUploading ? (
        <div className="flex flex-col items-center text-crimson">
          <Loader2 size={32} className="animate-spin mb-3" />
          <p className="font-bold text-sm">Uploading...</p>
        </div>
      ) : (
        <>
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 mb-3 group-hover:bg-crimson/10 group-hover:text-crimson group-hover:scale-110 transition-all">
            <Upload size={24} />
          </div>
          <p className="font-bold text-slate-700 text-sm">Click to upload cover image</p>
          <p className="text-xs font-medium text-slate-400 mt-1">Recommended size: 1920x1080 (Max 5MB)</p>
        </>
      )}
    </label>
  );
}
