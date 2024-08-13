import React, { useState } from "react";

interface ImageUploaderProps {
  onFileChange: (file: File | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onFileChange }) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setPreview(URL.createObjectURL(file));
      onFileChange(file);
    } else {
      setPreview(null);
      onFileChange(null);
    }
  };

  return (
    <div className="mb-4">
      <label className="block">Upload Image:</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full mt-2"
      />
      {preview && (
        <div className="mt-2">
          <img src={preview} alt="Preview" className="object-cover w-full h-64" />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
