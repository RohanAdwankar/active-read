"use client";

import { useState } from 'react';
import TextProcessor from './text-processor';
import Quiz from './quiz';
import Chat from './chat';
import Summary from './summary';
import { Settings } from './settings-bar';
import { Word } from '../types';


interface LearnProps {
  processedText: Word[];
  onBack: () => void;
  settings?: Settings;
  pageTitle?: string;
}

export default function Learn({ processedText, onBack, settings, pageTitle }: LearnProps) {
  const [showQuiz, setShowQuiz] = useState(false);
  const [activeParagraph, setActiveParagraph] = useState<number | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [completedParagraphs, setCompletedParagraphs] = useState<{[key: number]: boolean}>({});
  const [score, setScore] = useState<{correct: number, total: number} | null>(null);

  // Group words into paragraphs
  const paragraphs = groupIntoParagraphs(processedText);
  
  const handleQuizActivate = (paragraphIndex: number) => {
    setActiveParagraph(paragraphIndex);
    setShowQuiz(true);
    setShowSummary(false);
  };
  
  const handleSummaryActivate = (paragraphIndex: number) => {
    setActiveParagraph(paragraphIndex);
    setShowSummary(true);
    setShowQuiz(false);
  };
  
  // Update the handleComplete function to track which paragraphs are completed
  const handleComplete = (correct: number, total: number, paragraphIndex: number) => {
    console.log("Paragraph completed:", paragraphIndex, "Score:", correct, "/", total);
    
    // Mark this paragraph as completed
    setCompletedParagraphs(prevState => {
      return { 
        ...prevState, 
        [paragraphIndex]: true 
      };
    });

    setScore({ correct, total });
  };

  // Get the full text content for context
  const fullText = processedText.map(word => word.originalWord || word.text).join('');
  
  // Get the text for a specific paragraph
  const getParagraphText = (paragraph: Word[]): string => {
    return paragraph.map(word => word.originalWord || word.text).join('');
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Main content area */}
        <div className="flex-grow md:w-3/4 pr-72">
          <div className="mb-4">
            <button 
              onClick={onBack} 
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to input options
            </button>
          </div>
          
          <h2 className="text-2xl font-bold mb-6">{ (pageTitle) ? pageTitle : "Active Reading" }</h2>
          
          {settings && (
            <div className="inline-block bg-gray-100 rounded-md px-3 py-1 text-sm text-gray-600 mb-6 select-none">
              Exercise difficulty: <span className="font-medium">{settings.blankFrequency}%</span> 
              <span className="ml-1 text-xs text-gray-500"></span>
            </div>
          )}
          
          {paragraphs.map((paragraph, index) => (
            <div key={index} className="mb-10">
              <TextProcessor 
                processedText={paragraph} 
                onComplete={(correct, total) => handleComplete(correct, total, index)}
                isParagraph={true}
                isFirst={index === 0}
                darkMode={settings?.darkMode}
                paragraphIndex={index} // Pass the paragraph index
              />
              
              {/* Only show buttons after paragraph is completed */}
              {completedParagraphs[index] || true && (
                <div 
                  className="mt-6 flex gap-3 transition-all animate-fadeIn" 
                  id={`paragraph-actions-${index}`}
                >
                  <button
                    onClick={() => handleQuizActivate(index)}
                    ref={completedParagraphs[index] && !activeParagraph ? (el) => el?.focus() : null}
                    className={`px-4 py-2 rounded-md text-white ${
                      settings?.darkMode 
                        ? 'bg-purple-600 hover:bg-purple-500' 
                        : 'bg-purple-600 hover:bg-purple-700'
                    }`}
                  >
                    Quiz on this paragraph
                  </button>
                  <button
                    onClick={() => handleSummaryActivate(index)}
                    className={`px-4 py-2 rounded-md text-white ${
                      settings?.darkMode 
                        ? 'bg-green-600 hover:bg-green-500' 
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    Summarize this paragraph
                  </button>
                </div>
              )}
              
              {/* Display Quiz or Summary based on what was clicked */}
              {activeParagraph === index && (
                <div className="mt-6 animate-fadeIn">
                  {showQuiz && (
                    <div className={`p-4 rounded-lg ${
                      settings?.darkMode 
                        ? 'bg-purple-900/30 border border-purple-700' 
                        : 'bg-purple-50 border border-purple-200'
                    }`}>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className={`font-semibold text-lg ${settings?.darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                          Quiz on Paragraph
                        </h3>
                        <button 
                          onClick={() => setShowQuiz(false)}
                          className={`${settings?.darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                      <Quiz 
                        text={getParagraphText(paragraphs[activeParagraph])}
                        darkMode={settings?.darkMode}
                      />
                    </div>
                  )}
                  
                  {showSummary && (
                    <Summary 
                      text={getParagraphText(paragraph)} 
                      onClose={() => setShowSummary(false)}
                      darkMode={settings?.darkMode} 
                    />
                  )}
                </div>
              )}
            </div>
          ))}
          
          {score && (
            <div className={`w-full my-4 p-4 rounded-lg ${
              settings?.darkMode ? 'bg-blue-900/30 text-gray-100' : 'bg-blue-100 text-gray-800'
            }`}>
              <h3 className={`text-xl font-bold ${settings?.darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                Your Score: {score.correct} / {score.total}
              </h3>
              <p className={settings?.darkMode ? 'text-gray-300' : 'text-gray-700'}>
                {score.correct === score.total 
                  ? "Perfect! You got all the words right."
                  : `You got ${score.correct} out of ${score.total} words correct.`}
              </p>
            </div>
          )}
        </div>
        
        <div className={`fixed right-0 top-0 bottom-0 w-64 p-4 h-screen pt-20 z-10
          ${settings?.darkMode ? 'bg-gray-800 text-gray-200 border-l border-gray-700' : 'bg-white text-gray-800 border-l border-gray-200'}`}>
          <Chat context={fullText} darkMode={settings?.darkMode} />
        </div>
      </div>
    </div>
  );
}

// Helper function to group words into paragraphs
function groupIntoParagraphs(words: Word[]): Word[][] {
  const paragraphs: Word[][] = [];
  let currentParagraph: Word[] = [];
  let charCount = 0;
  const minCharThreshold = 150; // Minimum chars for a paragraph
  
  words.forEach((word) => {
    if (word.text !== '\n') {
      currentParagraph.push(word);
      charCount += word.text.length;
    } else {
      // When we encounter a newline
      
      // Always add the newline for visual separation
      // Creating a copy of the newline word to ensure paragraph separation is visible
      currentParagraph.push({...word});
      
      // Only create a new paragraph if we've accumulated enough content
      if (charCount >= minCharThreshold) {
        paragraphs.push([...currentParagraph]);
        currentParagraph = [];
        charCount = 0;
      }
      // Otherwise, we keep the current paragraph going (with the added newline)
    }
  });
  
  // Add any remaining text as the last paragraph if it's not empty
  if (currentParagraph.length > 0 && charCount > 0) {
    paragraphs.push(currentParagraph);
  }
  
  // Filter out any paragraphs with 0 characters
  const filteredParagraphs = paragraphs.filter(paragraph => {
    const paragraphText = paragraph.map(word => word.text).join('').replace(/\n/g, '').trim();
    return paragraphText.length > 0;
  });
  
  // If we ended up with no paragraphs or just one very large paragraph,
  // split the content into reasonable chunks
  if (filteredParagraphs.length === 0 || (filteredParagraphs.length === 1 && words.length > 100)) {
    // Clear existing paragraphs to avoid duplication
    filteredParagraphs.length = 0;
    
    // Split into chunks of approximately 100-150 words
    const chunkSize = 150;
    for (let i = 0; i < words.length; i += chunkSize) {
      const chunk = words.slice(i, i + chunkSize);
      // Only add chunk if it has content
      if (chunk.some(word => word.text.trim().length > 0)) {
        filteredParagraphs.push(chunk);
      }
    }
  }
  
  // Ensure every paragraph has at least one blank word
  for (let i = 0; i < filteredParagraphs.length; i++) {
    ensureParagraphHasBlank(filteredParagraphs[i]);
  }
  
  return filteredParagraphs;
}

// Helper function to ensure a paragraph has at least one blank word
function ensureParagraphHasBlank(paragraph: Word[]): void {
  // Check if paragraph already has at least one blank word
  const hasBlank = paragraph.some(word => word.isBlank === true);
  
  if (!hasBlank) {
    // Find a suitable word to blank out
    const candidates = paragraph.filter(word => {
      // Exclude newlines, punctuation, and very short words
      return (
        word.text !== '\n' && 
        !/^[.,;:!?()'"]+$/.test(word.text) && 
        word.text.length > 3
      );
    });
    
    if (candidates.length > 0) {
      // Choose a word from the middle portion of the paragraph
      const middleIndex = Math.floor(candidates.length / 2);
      // Add some randomness to avoid always picking same position
      const selectedIndex = Math.max(0, Math.min(candidates.length - 1, 
        middleIndex + Math.floor(Math.random() * 3) - 1));
        
      // Make the selected word blank
      candidates[selectedIndex].isBlank = true;
      // Keep original word for reference
      candidates[selectedIndex].originalWord = candidates[selectedIndex].text;
    }
  }
}

// Helper to extract original text from words
function getOriginalText(words: Word[]): string {
  return words.map(word => word.originalWord || word.text).join('');
}
