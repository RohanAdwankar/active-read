"use client";

import { useState, useEffect } from 'react';
import { Word } from '../types';

interface TextProcessorProps {
  processedText: Word[];
  onComplete: (score: number, total: number) => void;
  isParagraph?: boolean;
  isFirst?: boolean;
  darkMode?: boolean;
}

export default function TextProcessor({ 
  processedText, 
  onComplete, 
  isParagraph = false, 
  isFirst = false,
  darkMode = false
}: TextProcessorProps) {
  const [words, setWords] = useState<Word[]>(processedText);
  const [submitted, setSubmitted] = useState(false);

  // Check if paragraph is too short (less than 5 words)
  if (processedText.length < 5) {
    return null; // Don't render this paragraph
  }

  // Check if we have any blanks to fill in
  const blanksCount = processedText.filter(word => word.isBlank).length;
  if (blanksCount === 0) {
    return (
      <div className={isParagraph ? "" : "w-full max-w-3xl mx-auto my-8"}>
        <div className={`p-6 rounded-lg ${
          darkMode 
            ? 'bg-gray-800 text-gray-200' 
            : 'bg-white text-gray-800'
        } ${!isParagraph ? 'shadow-md' : ''}`}>
          <div className="text-lg leading-relaxed mb-4">
            {processedText.map((word) => (
              <span key={word.id} className={darkMode ? "text-gray-200" : "text-gray-800"}>
                {word.text}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

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

  useEffect(() => {
    if (!isFirst) return;
    const blanks = words.filter(word => word.isBlank);
    const firstBlank = blanks[0];
    if (firstBlank) {
      const firstInput = document.getElementById(`input-${firstBlank.id}`);
      if (firstInput) {
        (firstInput as HTMLInputElement).focus();
      }
    }
  }, []);

  return (
    <div className={isParagraph ? "" : "w-full max-w-3xl mx-auto my-8"}>
      <div className={`p-6 rounded-lg ${
        darkMode 
          ? 'bg-gray-800 text-gray-200' 
          : 'bg-white text-gray-800'
      } ${!isParagraph ? 'shadow-md' : ''}`}>
        <div className="text-lg leading-relaxed mb-4">
          {words.map((word, index) => (
            <span 
              key={word.id} 
              className={`${index > 0 ? "ml-1" : ""} ${darkMode ? "text-gray-200" : "text-gray-800"}`}
            >
              {word.isBlank ? (
                <span className="inline-block">
                  <input
                    type="text"
                    value={''}
                    onChange={(e) => handleInputChange(word.id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === 'Tab') {
                        e.preventDefault();
                    
                        // Mark this input as submitted
                        setWords((prevWords) =>
                          prevWords.map((w) =>
                            w.id === word.id ? { ...w, submitted: true } : w
                          )
                        );
                    
                        // Find the next blank input field
                        const blanks = words.filter(w => w.isBlank && !w.submitted);
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
                    className={`border-b-2 text-left pl-2 mx-1 
                      ${word.submitted 
                        ? word.text.toLowerCase() === word.originalWord?.toLowerCase()
                          ? darkMode ? 'border-green-500 bg-green-900/30 text-green-300' : 'border-green-500 bg-green-100'
                          : darkMode ? 'border-red-500 bg-red-900/30 text-red-300' : 'border-red-500 bg-red-100'
                        : darkMode ? 'border-gray-600 bg-gray-700 text-gray-200' : 'border-gray-400 bg-white'
                      }`}
                    disabled={word.submitted}
                    style={{
                      width: `${Math.max(4, word.originalWord?.length || 0) * 10}px`,
                      minWidth: '60px'
                    }}
                  />
                  {word.submitted && word.text.toLowerCase() !== word.originalWord?.toLowerCase() && (
                    <span className={`text-xs block pl-2 ${
                      darkMode ? 'text-red-400' : 'text-red-600'
                    }`}>
                      {word.originalWord}
                    </span>
                  )}
                </span>
              ) : (
                <span className={darkMode ? "text-gray-200" : "text-gray-800"}>
                  {word.text}
                </span>
              )}
            </span>
          ))}
        </div>
        
        {!submitted ? (
          <button
            onClick={handleSubmit}
            className={`py-2 px-4 rounded-md transition-colors ${
              darkMode 
                ? 'bg-green-600 hover:bg-green-500 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            Check Answers
          </button>
        ) : (
          <div className={`font-medium ${
            words.filter(word => word.isBlank).every(
              word => word.text.toLowerCase() === word.originalWord?.toLowerCase()
            ) 
              ? darkMode ? 'text-green-400' : 'text-green-700'
              : darkMode ? 'text-amber-400' : 'text-amber-700'
          }`}>
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
