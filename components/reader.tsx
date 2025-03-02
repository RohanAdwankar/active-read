"use client";

import { useState } from 'react';
import Input from './input';
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

  return (
    <div className="container mx-auto px-4">
      {!processedText && !loading && (
        <Input onTextSubmit={handleTextSubmit} />
      )}
      
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {processedText && !loading && (
        <>
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
