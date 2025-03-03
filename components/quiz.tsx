"use client";

import { useState, useEffect } from 'react';
import { Question } from '../types';

interface QuizProps {
  text: string;
  darkMode?: boolean;
}

export default function Quiz({ text, darkMode = false }: QuizProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch quiz questions from the API
    const generateQuiz = async () => {
      try {
        const response = await fetch('/api/generate-quiz', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to generate quiz questions');
        }
        
        const data = await response.json();
        setQuestions(data.questions);
      } catch (error) {
        console.error('Error generating quiz:', error);
        // Fallback to default questions if the API fails
        setQuestions([
          {
            question: "Based on the passage, what can be inferred?",
            options: [
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ],
            correctAnswer: 1
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    if (text) {
      generateQuiz();
    }
  }, [text]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
  };

  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center h-64 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        <div className={`animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 ${darkMode ? 'border-blue-400' : 'border-blue-500'}`}></div>
        <p className={`mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Generating quiz questions...</p>
      </div>
    );
  }
  
  if (questions.length === 0) {
    return (
      <div className={`text-center p-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        <p>Unable to generate quiz questions for this text.</p>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="text-center">
        <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
          Quiz Complete!
        </h3>
        <p className={`text-lg mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          Your Score: {score}/{questions.length}
        </p>
        <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {score === questions.length
            ? "Perfect! You've mastered this section."
            : "Good effort! Review the paragraph again for better understanding."}
        </p>
        <button 
          onClick={handleRestart}
          className={`px-4 py-2 rounded-md ${
            darkMode
              ? 'bg-blue-600 hover:bg-blue-500 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          Retry Quiz
        </button>
      </div>
    );
  }

  return (
    <div style={{ minWidth: '300px' }}>
      <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
        Quiz: Question {currentQuestion + 1}/{questions.length}
      </h3>
      
      <p className={`mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
        {questions[currentQuestion].question}
      </p>
      
      <div className="space-y-3 mb-6">
        {questions[currentQuestion].options.map((option, index) => (
          <div 
            key={index}
            onClick={() => handleAnswerSelect(index)}
            className={`p-3 border rounded-md cursor-pointer transition-colors duration-200 ${
              selectedAnswer === index 
                ? darkMode
                  ? 'bg-blue-900/50 border-blue-500 text-blue-100'
                  : 'bg-blue-100 border-blue-500 text-blue-900'
                : darkMode
                  ? 'border-gray-700 text-gray-200 hover:bg-gray-700'
                  : 'border-gray-300 hover:bg-gray-50 text-gray-800'
            }`}
          >
            {option}
          </div>
        ))}
      </div>
      
      <button
        onClick={handleNextQuestion}
        disabled={selectedAnswer === null}
        className={`w-full py-2 rounded-md ${
          selectedAnswer !== null
            ? darkMode
              ? 'bg-blue-600 hover:bg-blue-500 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
            : darkMode
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
      </button>
    </div>
  );
}
