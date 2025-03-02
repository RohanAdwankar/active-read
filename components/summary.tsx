"use client";

import { useState } from 'react';

interface SummaryProps {
  text: string;
  onClose: () => void;
}

export default function Summary({ text, onClose }: SummaryProps) {
  const [summary, setSummary] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary.trim()) return;
    
    // Simulate feedback on the summary
    setFeedback("Good summary! You've captured the main points well. Consider adding a bit more about the key implications mentioned in the paragraph.");
  };
  
  return (
    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-lg">Summarize This Paragraph</h3>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      <p className="text-sm text-gray-600 mb-3">
        Try to summarize the main points of this paragraph in your own words.
      </p>
      
      <form onSubmit={handleSubmit}>
        <textarea 
          className="w-full p-3 border rounded-md min-h-[100px] resize-y"
          placeholder="Write your summary here..."
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        ></textarea>
        
        {feedback && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-md text-sm">
            <strong className="block mb-1">Feedback:</strong>
            {feedback}
          </div>
        )}
        
        <div className="mt-3 flex justify-end">
          <button 
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Submit Summary
          </button>
        </div>
      </form>
    </div>
  );
}
