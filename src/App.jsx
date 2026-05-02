import React, { useState } from 'react';
import Uploader from './components/Uploader';
import PreviewCard from './components/PreviewCard';
import SuccessView from './components/SuccessView';
import { convertImageToPdfWithLink, embedLinkInPdf } from './utils/fileProcessor';

/**
 * Main Application Component for the Smart Link Embedder.
 * This component manages the state for file uploads, URL inputs, and the generated result.
 */
function App() {
  // State variables to hold user inputs and process status
  const [file, setFile] = useState(null); // The uploaded image or PDF file
  const [url, setUrl] = useState(''); // The target URL provided by the user
  const [isProcessing, setIsProcessing] = useState(false); // Loading state during file processing
  const [resultUrl, setResultUrl] = useState(null); // The object URL pointing to the final generated file for download
  const [resultName, setResultName] = useState(''); // The filename for the generated download file
  const [error, setError] = useState(''); // Error message if validation or processing fails

  /**
   * Handles the selection of a valid file from the Uploader component.
   * @param {File} selectedFile - The file chosen by the user.
   */
  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setError(''); // Clear any previous errors when a new file is selected
  };

  /**
   * Clears the currently selected file so the user can upload a different one.
   */
  const handleClearFile = () => {
    setFile(null);
    setError('');
  };

  /**
   * Resets the entire application state back to its initial view,
   * allowing the user to start a completely new generation process.
   */
  const handleReset = () => {
    setFile(null);
    setUrl('');
    setResultUrl(null);
    setResultName('');
    setError('');
  };

  /**
   * Validates if a given string is a properly formatted URL.
   * @param {string} urlStr - The string to validate.
   * @returns {boolean} True if the string is a valid URL, otherwise false.
   */
  const validateUrl = (urlStr) => {
    try {
      new URL(urlStr); // Throws an error if urlStr is not a valid URL
      return true;
    } catch (_) {
      return false;
    }
  };

  /**
   * The core handler that is triggered when the "Generate Smart File" button is clicked.
   * It performs validation and calls the appropriate file processing utilities.
   */
  const handleGenerate = async () => {
    // 1. Validate File Existence
    if (!file) {
      setError('Please upload a file.');
      return;
    }
    
    // 2. Validate URL formatting
    if (!url || !validateUrl(url)) {
      setError('Please enter a valid URL (e.g., https://example.com).');
      return;
    }

    // Begin processing
    setIsProcessing(true);
    setError('');

    try {
      let finalBlob;
      let finalName;

      // 3. Check the file type and process accordingly
      if (file.type.startsWith('image/')) {
        // If it's an image, convert it to a PDF containing the invisible link
        finalBlob = await convertImageToPdfWithLink(file, url);
        // Rename the original file extension to .pdf
        finalName = file.name.replace(/\.[^/.]+$/, "") + "_linked.pdf";
      } else if (file.type === 'application/pdf') {
        // If it's already a PDF, just embed the link into the existing pages
        finalBlob = await embedLinkInPdf(file, url);
        // Append _linked to the filename
        finalName = file.name.replace(/\.[^/.]+$/, "") + "_linked.pdf";
      } else {
        throw new Error('Unsupported file format.');
      }

      // 4. Create a temporary, local URL pointing to the newly generated Blob
      // This URL can be used directly in an <a> tag for downloading
      const downloadUrl = URL.createObjectURL(finalBlob);
      
      // Update state to render the SuccessView
      setResultUrl(downloadUrl);
      setResultName(finalName);
    } catch (err) {
      console.error(err);
      setError('Failed to process the file. Please try again.');
    } finally {
      // End processing state regardless of success or failure
      setIsProcessing(false);
    }
  };

  return (
    <div className="app-container">
      <div className="glass-panel">
        
        {/* Header Section */}
        <div className="header">
          <h1>Smart Link Embedder</h1>
          <p>Embed clickable links directly into images and PDFs</p>
        </div>

        {/* Conditional Rendering: If there's no resultUrl, show the input form. Otherwise, show the success screen. */}
        {!resultUrl ? (
          <div className="fade-in">
            
            {/* If a file hasn't been selected, show Uploader. Otherwise, show the PreviewCard */}
            {!file ? (
              <Uploader onFileSelect={handleFileSelect} />
            ) : (
              <PreviewCard file={file} onClear={handleClearFile} />
            )}

            {/* URL Input Form Group */}
            <div className="input-group">
              <label htmlFor="url-input">Target URL</label>
              <input 
                id="url-input"
                type="url" 
                className="input-field" 
                placeholder="https://your-link.com" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              {/* Display error messages directly below the input if validation fails */}
              {error && <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>{error}</p>}
            </div>

            {/* Generate Button. Disabled if a file or URL is missing, or if it is currently processing. */}
            <button 
              className="btn-primary" 
              onClick={handleGenerate}
              disabled={isProcessing || !file || !url}
            >
              {isProcessing ? 'Processing...' : 'Generate Smart File'}
            </button>
          </div>
        ) : (
          /* Render the success screen with download and reset options */
          <SuccessView 
            onReset={handleReset} 
            downloadUrl={resultUrl} 
            downloadName={resultName} 
          />
        )}
      </div>
    </div>
  );
}

export default App;
