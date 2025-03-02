"use client";

import { useState } from 'react';
import TextProcessor from './text-processor';
import Quiz from './quiz';
import Chat from './chat';
import Summary from './summary';
import { Settings } from './settings-bar';

interface Word {
  id: number;
  text: string;
  isBlank: boolean;
  originalWord?: string;
}

interface LearnProps {
  processedText: Word[];
  onBack: () => void;
  settings?: Settings;
}

export default function Learn({ processedText, onBack, settings }: LearnProps) {
  const [showQuiz, setShowQuiz] = useState(false);
  const [activeParagraph, setActiveParagraph] = useState<number | null>(null);
  const [score, setScore] = useState<{correct: number, total: number} | null>(null);
  const [showSummary, setShowSummary] = useState(false);

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
  
  const handleComplete = (correct: number, total: number) => {
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
        <div className="flex-grow">
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
          
          <h2 className="text-2xl font-bold mb-6">Active Reading</h2>
          
          {settings && (
            <div className="inline-block bg-gray-100 rounded-md px-3 py-1 text-sm text-gray-600 mb-6">
              Current difficulty: <span className="font-medium">{settings.blankFrequency}%</span> word removal
            </div>
          )}
          
          {paragraphs.map((paragraph, index) => (
            <div key={index} className="mb-10">
              <TextProcessor 
                processedText={paragraph} 
                onComplete={handleComplete}
                isParagraph={true}
              />
              
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => handleQuizActivate(index)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Quiz on this paragraph
                </button>
                <button
                  onClick={() => handleSummaryActivate(index)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Summarize this paragraph
                </button>
              </div>
              
              {activeParagraph === index && showSummary && (
                <Summary 
                  text={getParagraphText(paragraph)} 
                  onClose={() => setShowSummary(false)} 
                />
              )}
            </div>
          ))}
          
          {score && (
            <div className="w-full my-4 p-4 bg-blue-100 rounded-lg">
              <h3 className="text-xl font-bold">Your Score: {score.correct} / {score.total}</h3>
              <p className="text-gray-700">
                {score.correct === score.total 
                  ? "Perfect! You got all the words right."
                  : `You got ${score.correct} out of ${score.total} words correct.`}
              </p>
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        <div className={`w-full md:w-80 bg-white p-4 rounded-lg shadow ${showQuiz ? '' : 'opacity-50 pointer-events-none'}`}>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Learning Tools</h3>
            <div className="flex border-b">
              <button
                className={`py-2 px-4 border-b-2 ${showQuiz ? 'border-blue-600 text-blue-600' : 'border-transparent'}`}
                onClick={() => setShowQuiz(true)}
              >
                Quiz
              </button>
              <button
                className={`py-2 px-4 border-b-2 ${!showQuiz ? 'border-blue-600 text-blue-600' : 'border-transparent'}`}
                onClick={() => setShowQuiz(false)}
              >
                Chat
              </button>
            </div>
          </div>
          
          {showQuiz && activeParagraph !== null ? (
            <Quiz text={getParagraphText(paragraphs[activeParagraph])} />
          ) : (
            <Chat context={fullText} />
          )}
          
          {!showQuiz && (
            <div className="mt-4 text-center text-sm text-gray-500">
              <p>Start a conversation about what you're reading</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper function to group words into paragraphs
function groupIntoParagraphs(words: Word[]): Word[][] {
  const paragraphs: Word[][] = [];
  let currentParagraph: Word[] = [];
  
  words.forEach((word) => {
    currentParagraph.push(word);
    
    // If word has a newline or period followed by space, end paragraph
    if (word.text === '\n') {
      if (currentParagraph.length > 10) { // Ensure paragraph has reasonable length
        paragraphs.push([...currentParagraph]);
        currentParagraph = [];
      }
    }
  });
  
  // Add any remaining text as the last paragraph
  if (currentParagraph.length > 0) {
    paragraphs.push(currentParagraph);
  }
  
  // If we ended up with no paragraphs or just one tiny one, 
  // just treat the whole text as one paragraph
  if (paragraphs.length === 0 || (paragraphs.length === 1 && words.length > 100)) {
    // Split into chunks of approximately 100-150 words
    const chunkSize = 150;
    for (let i = 0; i < words.length; i += chunkSize) {
      paragraphs.push(words.slice(i, i + chunkSize));
    }
  }
  
  return paragraphs;
}

// Helper to extract original text from words
function getOriginalText(words: Word[]): string {
  return words.map(word => word.originalWord || word.text).join('');
}
