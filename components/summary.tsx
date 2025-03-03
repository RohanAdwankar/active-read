"use client";

import { useState } from 'react';
import { SummaryResponse } from '../types';

interface SummaryProps {
  text: string;
  onClose: () => void;
  darkMode?: boolean;
}

export default function Summary({ text, onClose, darkMode = false }: SummaryProps) {
  const [summary, setSummary] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary.trim()) return;
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/validate-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalText: text,
          userSummary: summary
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to validate summary');
      }
      
      const data: SummaryResponse = await response.json();
      setFeedback(data.feedback);
      if (data.score) setScore(data.score);
    } catch (error) {
      console.error('Error validating summary:', error);
      setFeedback('Unable to validate your summary at this time. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className={`mt-4 p-4 rounded-md ${
      darkMode 
        ? 'bg-green-900/30 border border-green-700' 
        : 'bg-green-50 border border-green-200'
    }`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className={`font-semibold text-lg ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
          Summarize This Paragraph
        </h3>
        <button 
          onClick={onClose}
          className={`${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} transition-colors duration-200`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      <p className={`text-sm mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        Try to summarize the main points of this paragraph in your own words.
      </p>
      
      <form onSubmit={handleSubmit}>
        <textarea 
          className={`w-full p-3 border rounded-md min-h-[100px] resize-y ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-green-500 focus:ring-1 focus:ring-green-500/30' 
              : 'bg-white border-gray-300 text-gray-900 focus:border-green-500 focus:ring-1 focus:ring-green-500/30'
          }`}
          placeholder="Write your summary here..."
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          disabled={loading}
        ></textarea>
        
        {feedback && (
          <div className={`mt-3 p-3 rounded-md text-sm ${
            darkMode 
              ? 'bg-blue-900/30 border border-blue-700 text-gray-100' 
              : 'bg-blue-50 border border-blue-100 text-gray-800'
          }`}>
            <div className="flex justify-between items-center">
              <strong className="block mb-1">Feedback:</strong>
              {score && (
                <span className={`px-2 py-1 rounded ${
                  score >= 80 
                    ? darkMode ? 'bg-green-900/50 text-green-100' : 'bg-green-100 text-green-800'
                    : score >= 60 
                      ? darkMode ? 'bg-yellow-900/50 text-yellow-100' : 'bg-yellow-100 text-yellow-800' 
                      : darkMode ? 'bg-red-900/50 text-red-100' : 'bg-red-100 text-red-800'
                }`}>
                  Score: {score}/100
                </span>
              )}
            </div>
            <div className={darkMode ? 'text-gray-200' : 'text-gray-700'}>
              {feedback}
            </div>
          </div>
        )}
        
        <div className="mt-3 flex justify-end gap-2">
          {feedback && (
            <button 
              type="button"
              onClick={() => {setFeedback(null); setScore(null);}}
              className={`px-4 py-2 rounded-md ${
                darkMode 
                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Revise
            </button>
          )}
          <button 
            type="submit"
            className={`px-4 py-2 rounded-md ${
              darkMode 
                ? 'bg-blue-600 text-white hover:bg-blue-500' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            } ${loading || summary.trim().length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading || summary.trim().length === 0}
          >
            {loading ? 'Submitting...' : feedback ? 'Re-submit' : 'Submit Summary'}
          </button>
        </div>
      </form>
    </div>
  );
}
