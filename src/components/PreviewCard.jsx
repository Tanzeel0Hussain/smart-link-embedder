import React from 'react';
import { FileIcon, ImageIcon, X } from 'lucide-react';

const PreviewCard = ({ file, onClear }) => {
  const isPdf = file.type === 'application/pdf';
  
  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="preview-container fade-in">
      <div className="preview-thumbnail">
        {isPdf ? <FileIcon size={32} color="#f8fafc" /> : <ImageIcon size={32} color="#f8fafc" />}
      </div>
      <div className="preview-info">
        <div className="preview-name">{file.name}</div>
        <div className="preview-size">{formatSize(file.size)}</div>
      </div>
      <button className="btn-icon" onClick={onClear} aria-label="Remove file">
        <X size={20} />
      </button>
    </div>
  );
};

export default PreviewCard;
