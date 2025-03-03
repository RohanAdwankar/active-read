"use client";

import { useState } from 'react';

interface UrlInputProps {
  onTextSubmit: (text: string) => void;
  onBack?: () => void;
  compact?: boolean;
  darkMode?: boolean;
}

export default function UrlInput({ onTextSubmit, onBack, compact = false, darkMode = false }: UrlInputProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/scrape-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch content from URL');
      }
      
      const data = await response.json();
      if (data.text) {
        onTextSubmit(data.text);
      } else {
        setError('No content found at the provided URL');
      }
    } catch (error) {
      console.error('Error scraping URL:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch content from URL');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={compact ? "" : "w-full max-w-3xl mx-auto my-8"}>
      {!compact && onBack && (
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
            Extract Text from URL
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

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="relative">
          <input
            type="url"
            className={`w-full p-3 pl-10 border rounded-md transition-all duration-300 focus:ring-2 focus:outline-none
              ${darkMode 
                ? 'bg-gray-800 text-gray-100 border-gray-700 focus:border-blue-500 focus:ring-blue-500/20' 
                : 'bg-white text-gray-900 border-gray-300 focus:border-blue-600 focus:ring-blue-600/20'}`}
            placeholder="Enter a URL (e.g., https://example.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
        </div>
        
        {error && (
          <p className={`text-sm ${darkMode ? 'text-red-400' : 'text-red-600'} animate-fadeIn`}>
            {error}
          </p>
        )}

        <button 
          type="submit"
          disabled={loading}
          className={`py-2 px-4 rounded-md flex items-center justify-center transition-colors duration-300
            ${darkMode 
              ? 'bg-blue-500 text-white hover:bg-blue-400' 
              : 'bg-blue-600 text-white hover:bg-blue-700'}
            ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
              <span>Extracting...</span>
            </>
          ) : (
            'Extract Content'
          )}
        </button>
      </form>
    </div>
  );
}
