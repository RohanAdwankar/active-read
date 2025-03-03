"use client";

import { useState } from 'react';

interface TextInputProps {
  onTextSubmit: (text: string) => void;
  onBack?: () => void;
  compact?: boolean;
  darkMode?: boolean;
}

export default function TextInput({ onTextSubmit, onBack, compact = false, darkMode = false }: TextInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onTextSubmit(text);
    }
  };

  return (
    <div className={compact ? "" : "w-full max-w-3xl mx-auto my-8"}>
      {!compact && onBack && (
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Copy & Paste Text</h2>
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
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <textarea
          className={`w-full p-3 border rounded-md resize-y ${darkMode ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-white text-gray-900 border-gray-300'}`}
          placeholder="Paste your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={compact ? 5 : 8}
        />
        <button 
          type="submit"
          className={`py-2 px-4 rounded-md transition-colors duration-300
            ${darkMode ? 'bg-blue-500 text-white hover:bg-blue-400' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
        >
          Create Exercise
        </button>
      </form>
    </div>
  );
}
