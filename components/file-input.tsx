"use client";

import { useState } from 'react';

interface FileInputProps {
  onTextSubmit: (text: string) => void;
  onBack?: () => void;
  compact?: boolean;
  darkMode?: boolean;
}

export default function FileInput({ onTextSubmit, onBack, compact = false, darkMode = false }: FileInputProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };
  
  const processFile = (file: File) => {
    setFileName(file.name);
    setProcessing(true);
    
    if (file.type.match('text.*') || 
        file.name.endsWith('.txt') || 
        file.name.endsWith('.md')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        if (text) {
          onTextSubmit(text);
        }
        setProcessing(false);
      };
      reader.readAsText(file);
    } else {
      alert('Please upload a text file (.txt, .md, etc)');
      setFileName(null);
      setProcessing(false);
    }
  };

  return (
    <div className={compact ? "" : "w-full max-w-3xl mx-auto my-8"}>
      {!compact && onBack && (
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
            Upload a Text File
          </h2>
          <button 
            onClick={onBack}
            className={`flex items-center transition-colors duration-300
              ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back
          </button>
        </div>
      )}

      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300
          ${isDragging 
            ? darkMode 
              ? 'border-blue-500 bg-blue-900/20' 
              : 'border-blue-500 bg-blue-50' 
            : darkMode 
              ? 'border-gray-700 hover:border-blue-700 hover:bg-blue-900/10' 
              : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50/50'
          }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-12 w-12 mb-4 ${
              darkMode 
                ? isDragging ? 'text-blue-400' : 'text-gray-400' 
                : isDragging ? 'text-blue-500' : 'text-gray-400'
            }`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
            />
          </svg>
          
          <p className={`mb-4 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Drag and drop a text file here
          </p>
          
          <p className={`mb-4 text-xs ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Supported formats: .txt, .md
          </p>
          
          <input
            type="file"
            id="file-input"
            className="hidden"
            accept=".txt,.md,text/plain"
            onChange={handleFileSelect}
          />
          
          <label
            htmlFor="file-input"
            className={`py-2 px-6 rounded-md transition-all duration-300 cursor-pointer inline-block
              ${darkMode 
                ? 'bg-blue-500 text-white hover:bg-blue-400' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
          >
            {processing ? (
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                <span>Processing...</span>
              </div>
            ) : (
              'Select File'
            )}
          </label>
          
          {fileName && !processing && (
            <div className={`mt-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'} animate-fadeIn`}>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium truncate max-w-xs">{fileName}</span>
              </div>
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Uploading and processing...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
