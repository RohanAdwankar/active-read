"use client";

import { useState, useRef } from 'react';

import {Word} from '../types';

interface TextProcessorProps {
  processedText: Word[];
  onComplete: (score: number, total: number) => void;
  isParagraph?: boolean;
}

export default function TextProcessor({ processedText, onComplete, isParagraph = false }: TextProcessorProps) {
  const [words, setWords] = useState<Word[]>(processedText);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (id: number, value: string) => {
    setWords(words.map(word => 
      word.id === id ? { ...word, text: value } : word
    ));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const blanks = words.filter(word => word.isBlank);
    const correct = blanks.filter(word => 
      word.text.toLowerCase() === word.originalWord?.toLowerCase()
    ).length;
    
    onComplete(correct, blanks.length);
  };

  return (
    <div className={isParagraph ? "" : "w-full max-w-3xl mx-auto my-8"}>
      <div className={`bg-white p-6 rounded-lg ${!isParagraph ? 'shadow' : ''}`}>
        <div className="text-lg leading-relaxed mb-4">
          {words.map((word, index) => (
            <span key={word.id} className="mr-1">
              {word.isBlank ? (
                <span className="inline-block">
                  <input
                    type="text"
                    value={word.text}
                    onChange={(e) => handleInputChange(word.id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === 'Tab') {
                        e.preventDefault();
                    
                        setWords((prevWords) =>
                          prevWords.map((w) =>
                            w.id === word.id ? { ...w, submitted: true } : w
                          )
                        );
                    
                        // Find the next blank input field
                        const blanks = words.filter(w => w.isBlank);
                        const currentIndex = blanks.findIndex(w => w.id === word.id);
                        const nextWord = blanks[currentIndex + 1];
                    
                        if (nextWord) {
                          const nextInput = document.getElementById(`input-${nextWord.id}`);
                          if (nextInput) {
                            (nextInput as HTMLInputElement).focus();
                          }
                        } else {
                          handleSubmit();
                        }
                      }
                    }}
                    id={`input-${word.id}`}
                    
                    className={`w-${Math.max(5, word.originalWord?.length || 0) * 8}px border-b-2 text-left pl-2 mx-1 
                      ${word.submitted 
                        ? word.text.toLowerCase() === word.originalWord?.toLowerCase()
                          ? 'border-green-500 bg-green-100'
                          : 'border-red-500 bg-red-100'
                        : 'border-gray-400'}`}
                    disabled={word.submitted}
                    size={Math.max(10, word.originalWord?.length || 0)}
                  />
                  {word.submitted && word.text.toLowerCase() !== word.originalWord?.toLowerCase() && (
                    <span className="text-xs text-red-600 block pl-2">{word.originalWord}</span>
                  )}
                </span>
              ) : (
                word.text
              )}
            </span>
          ))}
        </div>
        
        {!submitted ? (
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
          >
            Check Answers
          </button>
        ) : (
          <div className="text-green-700 font-medium">
            {words.filter(word => word.isBlank).every(
              word => word.text.toLowerCase() === word.originalWord?.toLowerCase()
            ) 
              ? "All correct! Great job!"
              : "Review your answers above."}
          </div>
        )}
      </div>
    </div>
  );
}
