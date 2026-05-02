import React, { useCallback, useState } from 'react';
import { UploadCloud } from 'lucide-react';

const Uploader = ({ onFileSelect }) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndSelectFile(file);
    }
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      validateAndSelectFile(file);
    }
  };

  const validateAndSelectFile = (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (validTypes.includes(file.type)) {
      onFileSelect(file);
    } else {
      alert('Please upload a valid JPG, PNG, or PDF file.');
    }
  };

  return (
    <div 
      className={`drop-zone fade-in ${isDragActive ? 'active' : ''}`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById('file-upload').click()}
    >
      <UploadCloud size={48} className="drop-zone-icon" />
      <p className="drop-zone-text">Click or drag and drop to upload</p>
      <p className="drop-zone-subtext">JPG, PNG, or PDF</p>
      <input 
        type="file" 
        id="file-upload" 
        style={{ display: 'none' }} 
        accept=".jpg,.jpeg,.png,.pdf"
        onChange={handleChange}
      />
    </div>
  );
};

export default Uploader;
