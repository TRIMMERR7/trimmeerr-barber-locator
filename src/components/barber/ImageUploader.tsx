
import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { useImageUpload } from '@/hooks/useImageUpload';

interface ImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  label: string;
  single?: boolean;
}

const ImageUploader = ({ 
  images, 
  onImagesChange, 
  maxImages = 5, 
  label,
  single = false 
}: ImageUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, uploading } = useImageUpload();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    for (const file of files) {
      if (file.type.startsWith('image/')) {
        try {
          const imageUrl = await uploadImage(file);
          
          if (single) {
            onImagesChange([imageUrl]);
          } else {
            onImagesChange([...images, imageUrl]);
          }
        } catch (error) {
          console.error('Upload failed:', error);
        }
      }
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const canAddMore = single ? images.length === 0 : images.length < maxImages;

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-300 block">{label}</label>
      
      {images.length > 0 && (
        <div className={`grid ${single ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3'} gap-3`}>
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image}
                alt={`${label} ${index + 1}`}
                className={`w-full ${single ? 'h-32' : 'h-24'} object-cover rounded-lg border border-gray-600`}
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {canAddMore && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple={!single}
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? 'Uploading...' : `Upload ${single ? 'Image' : 'Images'}`}
          </Button>
          {!single && (
            <p className="text-xs text-gray-500 mt-1">
              {images.length}/{maxImages} images uploaded
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
