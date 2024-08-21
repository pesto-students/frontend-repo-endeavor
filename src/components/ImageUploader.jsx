import React, { useEffect, useState } from 'react';
import './ImageUploader.css'; // Import the CSS file

const ImageUploader = ({ isMultiple, onImageSelect, initImages = isMultiple ? [] : null }) => {
  const [images, setImages] = useState(initImages);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
      setImages(initImages);
  }, [initImages]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (isMultiple) {
      const newFiles = files.filter((file) => 
        !images.some((image) => (image instanceof File && image.name === file.name && image.lastModified === file.lastModified))
      );
      const updatedImages = [...images, ...newFiles].slice(0, 10);
      onImageSelect(updatedImages);
    } else {
      const singleImage = files[0];
      if (!images || images.name !== singleImage.name) {
        onImageSelect(singleImage);
      }
    }
  };

  const handleRemoveImage = (index) => {
    if (isMultiple) {
      const updatedImages = images.filter((_, i) => i !== index);
      setImages(updatedImages);
      onImageSelect(updatedImages);
    } else {
      setImages(null);
      onImageSelect(null);
    }
  };

  const getImageSrc = (image) => {
    return image instanceof File ? URL.createObjectURL(image) : image;
  };

  return (
    <div>
      <input 
        type="file" 
        accept="image/*" 
        multiple={isMultiple} 
        onChange={handleImageChange} 
      />
      <div>
        {isMultiple ? (
          images.map((image, index) => (
            <div key={index}>
              <img 
                src={getImageSrc(image)} 
                alt="Selected" 
                style={{ maxHeight: '100px', cursor: 'pointer' }} 
                onClick={() => setSelectedImage(image)}
              />
              <button onClick={() => handleRemoveImage(index)}>Remove</button>
            </div>
          ))
        ) : (
          images && (
            <div>
              <img 
                src={getImageSrc(images)} 
                alt="Selected" 
                style={{ maxHeight: '200px', cursor: 'pointer' }} 
                onClick={() => setSelectedImage(images)}
              />
              <button onClick={() => handleRemoveImage()}>Remove</button>
            </div>
          )
        )}
      </div>

      {selectedImage && (
        <div className="modal">
          <div className="modal-content animate-in">
            <img 
              src={getImageSrc(selectedImage)} 
              alt="Selected Large" 
              style={{ maxHeight: '90vh', maxWidth: '90vw' }} 
            />
            <button onClick={() => setSelectedImage(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
