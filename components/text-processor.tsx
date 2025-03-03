"use client";

import { useState, useEffect, useRef } from 'react';
import { Word } from '../types';

// Update the props interface to include paragraph index
interface TextProcessorProps {
  processedText: Word[];
  onComplete: (score: number, total: number, paragraphIndex: number) => void;
  isParagraph?: boolean;
  isFirst?: boolean;
  darkMode?: boolean;
  paragraphIndex: number;
}

export default function TextProcessor({ 
  processedText, 
  onComplete, 
  isParagraph = false, 
  isFirst = false,
  darkMode = false,
  paragraphIndex
}: TextProcessorProps) {
  const [words, setWords] = useState<Word[]>(processedText);
  const [completed, setCompleted] = useState(false);
  const [filledCount, setFilledCount] = useState(0);
  
  // Track which answers are wrong and revealing
  const [wrongAnswers, setWrongAnswers] = useState<{[key: number]: boolean}>({});
  const [revealing, setRevealing] = useState<{[key: number]: boolean}>({});
  
  // Fix TypeScript error by allowing string keys
  const timeoutsRef = useRef<{[key: string | number]: NodeJS.Timeout}>({});
  
  // Track correct answers for score calculation
  const [correctCount, setCorrectCount] = useState(0);

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

  // Clear timeouts on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      Object.values(timeoutsRef.current).forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  // Process an individual word when it's filled in
  const processWord = (wordId: number, value: string) => {
    const word = words.find(w => w.id === wordId);
    if (!word || !word.originalWord) return;
    
    const isCorrect = value.toLowerCase() === word.originalWord.toLowerCase();
    
    if (value && value.trim() !== '' && !isCorrect) {
      // Mark this answer as wrong
      setWrongAnswers(prev => ({ ...prev, [wordId]: true }));
      
      // Set a timeout to reveal the correct answer after 2 seconds
      timeoutsRef.current[wordId] = setTimeout(() => {
        // Mark as revealing
        setRevealing(prev => ({ ...prev, [wordId]: true }));
        
        // After a brief animation period, replace with the correct word
        timeoutsRef.current[`reveal_${wordId}`] = setTimeout(() => {
          setWords(prevWords => 
            prevWords.map(w => 
              w.id === wordId ? { ...w, text: w.originalWord || '', submitted: true } : w
            )
          );
          
          // Remove from revealing state
          setRevealing(prev => {
            const newState = { ...prev };
            delete newState[wordId];
            return newState;
          });
          
          // Check if all words are now filled
          checkCompletionStatus();
        }, 500);
      }, 500);
    } else if (value && value.trim() !== '' && isCorrect) {
      // This answer is correct, mark it as submitted
      setWords(prevWords =>
        prevWords.map(w => 
          w.id === wordId ? { ...w, submitted: true } : w
        )
      );
      
      // Increment correct count
      setCorrectCount(prev => prev + 1);
      
      // Update filled count
      setFilledCount(prev => prev + 1);
      
      // Check if all words are now filled
      checkCompletionStatus();
    }
  };
  
  // Update the checkCompletionStatus function to pass the paragraph index
  const checkCompletionStatus = () => {
    const blanks = words.filter(word => word.isBlank);
    const filledBlanks = blanks.filter(word => word.submitted || revealing[word.id]);
    
    if (filledBlanks.length === blanks.length && !completed) {
      setCompleted(true);
      console.log(`Completing paragraph ${paragraphIndex} with score ${correctCount}/${blanks.length}`);
      // Pass the paragraph index to identify which paragraph was completed
      onComplete(correctCount, blanks.length, paragraphIndex);
    }
  };

  // Handle input changes
  const handleInputChange = (id: number, value: string) => {
    setWords(words.map(word => 
      word.id === id ? { ...word, text: value } : word
    ));
  };

  // Handle Enter/Tab key and word submission
  const handleInputSubmit = (id: number) => {
    const currentWord = words.find(word => word.id === id);
    if (!currentWord || !currentWord.text || currentWord.text.trim() === '') return;
    
    // Process this word
    processWord(id, currentWord.text);
    
    // Find the next blank input field
    const blanks = words.filter(w => w.isBlank && !w.submitted && !revealing[w.id]);
    const currentIndex = blanks.findIndex(w => w.id === id);
    const nextWord = blanks[currentIndex + 1];

    if (nextWord) {
      const nextInput = document.getElementById(`input-${nextWord.id}`);
      if (nextInput) {
        (nextInput as HTMLInputElement).focus();
      }
    }
  };

  // Auto-focus on first blank when component mounts
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
        <div className="text-lg leading-relaxed mb-4 min-h-[60px]">
          {words.map((word, index) => (
            <span 
              key={word.id} 
              className={`${index > 0 ? "ml-1" : ""} ${darkMode ? "text-gray-200" : "text-gray-800"}`}
            >
              {word.isBlank ? (
                <span className="inline-block relative">
                  {revealing[word.id] ? (
                    <span className={`animate-fadeIn border-b-2 px-2
                      ${darkMode 
                        ? 'border-green-500 text-green-300' 
                        : 'border-green-500 text-green-600'}`}
                    >
                      {word.originalWord}
                    </span>
                  ) : word.submitted ? (
                    <span className={`px-2 border-b-2 
                      ${word.text.toLowerCase() === word.originalWord?.toLowerCase()
                        ? darkMode ? 'border-green-500 bg-green-900/30 text-green-300' : 'border-green-500 bg-green-100'
                        : darkMode ? 'border-red-500 bg-red-900/30 text-red-300' : 'border-red-500 bg-red-100'
                      }`}
                    >
                      {word.text}
                    </span>
                  ) : (
                    <input
                      type="text"
                      value={''}
                      onChange={(e) => handleInputChange(word.id, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === 'Tab') {
                          e.preventDefault();
                          handleInputSubmit(word.id);
                        }
                      }}
                      onBlur={() => {
                        // Also process word when input loses focus
                        if (word.text && word.text.trim() !== '' && !word.submitted) {
                          handleInputSubmit(word.id);
                        }
                      }}
                      id={`input-${word.id}`}
                      className={`border-b-2 text-left px-2 mx-1 outline-none
                        ${wrongAnswers[word.id] 
                          ? darkMode ? 'animate-pulse border-red-500 bg-red-900/30 text-red-300' : 'animate-pulse border-red-500 bg-red-100'
                          : darkMode ? 'border-gray-600 bg-gray-700 text-gray-200' : 'border-gray-400 bg-white'
                        }`}
                      disabled={word.submitted || wrongAnswers[word.id]}
                      style={{
                        width: `${Math.max(5, word.originalWord?.length || 0) * 10}px`,
                        minWidth: '80px'
                      }}
                    />
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
      </div>
    </div>
  );
}
