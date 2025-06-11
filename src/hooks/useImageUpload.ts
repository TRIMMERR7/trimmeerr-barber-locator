
import { useState } from 'react';
import { toast } from 'sonner';

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file: File): Promise<string> => {
    setUploading(true);
    
    try {
      // For now, we'll use a placeholder URL
      // In a real app, you'd upload to a service like Supabase Storage
      const imageUrl = URL.createObjectURL(file);
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Image uploaded successfully!');
      return imageUrl;
    } catch (error) {
      toast.error('Failed to upload image');
      throw error;
    } finally {
      setUploading(false);
    }
  };

  return { uploadImage, uploading };
};
