"use client";

import { useState } from 'react';

interface UrlInputProps {
  onTextSubmit: (text: string) => void;
  onBack?: () => void;
  compact?: boolean;
}

export default function UrlInput({ onTextSubmit, onBack, compact = false }: UrlInputProps) {
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
          <h2 className="text-xl font-semibold">Extract Text from URL</h2>
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

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="url"
          className="w-full p-3 border rounded-md"
          placeholder="Enter a URL (e.g., https://example.com)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        
        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button 
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Fetching...' : 'Extract Content'}
        </button>
      </form>
    </div>
  );
}
