import React from 'react';

const FileUploader = ({ onUpload }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    // Check file size (limit to 5MB)
    if (file && file.size > 50000000) {
      alert('File is too large, please upload an image smaller than 50MB.');
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      onUpload(reader.result); // Send base64 data to parent component
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ marginBottom: '10px' }}>
      <input type="file" onChange={handleFileChange} />
    </div>
  );
};

export default FileUploader;
