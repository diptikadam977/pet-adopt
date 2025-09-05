import React, { useRef } from 'react';
import { Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ImagePickerProps {
  onImageSelect: (file: File) => void;
}

export function ImagePicker({ onImageSelect }: ImagePickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      onImageSelect(file);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={handleImageClick}
        title="Send image"
      >
        <Image className="w-4 h-4" />
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
}