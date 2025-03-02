"use client";

import { useState } from 'react';
import TextInput from './text-input';
import FileInput from './file-input';
import UrlInput from './url-input';
import TextProcessor from './text-processor';

interface Word {
  id: number;
  text: string;
  isBlank: boolean;
  originalWord?: string;
}

export default function Reader() {
  const [processedText, setProcessedText] = useState<Word[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState<{correct: number, total: number} | null>(null);
  
  const handleTextSubmit = async (text: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/process-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      
      if (!response.ok) throw new Error('Failed to process text');
      
      const result = await response.json();
      setProcessedText(result.processedText);
    } catch (error) {
      console.error('Error processing text:', error);
      alert('Failed to process text. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = (correct: number, total: number) => {
    setScore({ correct, total });
  };

  const handleReset = () => {
    setProcessedText(null);
    setScore(null);
  };

  return (
    <div className="container mx-auto px-4">
      {!processedText && !loading && (
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <div className="bg-white p-6 rounded-lg shadow-md h-full">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="text-3xl mr-2">📝</span>
                  Copy & Paste Text
                </h2>
                <TextInput onTextSubmit={handleTextSubmit} compact={true} />
              </div>
            </div>
            
            <div className="flex-1">
              <div className="bg-white p-6 rounded-lg shadow-md h-full">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="text-3xl mr-2">📄</span>
                  Upload a File
                </h2>
                <FileInput onTextSubmit={handleTextSubmit} compact={true} />
              </div>
            </div>
            
            <div className="flex-1">
              <div className="bg-white p-6 rounded-lg shadow-md h-full">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="text-3xl mr-2">🔗</span>
                  From URL
                </h2>
                <UrlInput onTextSubmit={handleTextSubmit} compact={true} />
              </div>
            </div>
          </div>
        </div>
      )}
      
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {processedText && !loading && (
        <>
          <div className="flex justify-center mb-4">
            <button 
              onClick={handleReset} 
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to input options
            </button>
          </div>
          
          <TextProcessor 
            processedText={processedText} 
            onComplete={handleComplete}
          />
          
          {score && (
            <div className="w-full max-w-3xl mx-auto my-4 p-4 bg-blue-100 rounded-lg text-center">
              <h3 className="text-xl font-bold">Your Score: {score.correct} / {score.total}</h3>
              <p className="text-gray-700">
                {score.correct === score.total 
                  ? "Perfect! You got all the words right."
                  : `You got ${score.correct} out of ${score.total} words correct.`}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
