"use client";

import { useState } from 'react';

interface FileInputProps {
  onTextSubmit: (text: string) => void;
  onBack?: () => void;
  compact?: boolean;
}

export default function FileInput({ onTextSubmit, onBack, compact = false }: FileInputProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  
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
    
    if (file.type.match('text.*') || 
        file.name.endsWith('.txt') || 
        file.name.endsWith('.md')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        if (text) {
          onTextSubmit(text);
        }
      };
      reader.readAsText(file);
    } else {
      alert('Please upload a text file (.txt, .md, etc)');
      setFileName(null);
    }
  };

  return (
    <div className={compact ? "" : "w-full max-w-3xl mx-auto my-8"}>
      {!compact && onBack && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Upload a Text File</h2>
          <button 
            onClick={onBack}
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back
          </button>
        </div>
      )}

      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <p className="mb-2 text-gray-700">
          Drag and drop a text file here
        </p>
        <input
          type="file"
          id="file-input-compact"
          className="hidden"
          accept=".txt,.md,text/plain"
          onChange={handleFileSelect}
        />
        <label
          htmlFor="file-input-compact"
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 cursor-pointer inline-block"
        >
          Select File
        </label>
        {fileName && (
          <p className="mt-2 text-gray-700 text-sm">Selected: {fileName}</p>
        )}
      </div>
    </div>
  );
}
