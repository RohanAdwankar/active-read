"use client";

import { useState, useEffect } from 'react';

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizProps {
  text: string;
}

export default function Quiz({ text }: QuizProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating quiz generation based on the text
    const generateQuiz = () => {
      setTimeout(() => {
        // Mock questions based on the text
        const mockQuestions: Question[] = [
          {
            question: "Based on the paragraph, what would be the most likely conclusion?",
            options: [
              "The topic is widely understood",
              "There are competing perspectives on this topic",
              "More research is needed",
              "The evidence is inconclusive"
            ],
            correctAnswer: 1
          },
          {
            question: "Which of these statements best represents the main idea?",
            options: [
              "A comprehensive explanation of the concept",
              "A historical overview of the subject",
              "A comparison of different approaches",
              "An argument for a specific position"
            ],
            correctAnswer: 3
          },
          {
            question: "What can be inferred from the paragraph?",
            options: [
              "The author supports traditional viewpoints",
              "The author is challenging conventional wisdom",
              "The author is presenting a balanced perspective",
              "The author is introducing a new concept"
            ],
            correctAnswer: 2
          }
        ];
        
        setQuestions(mockQuestions);
        setLoading(false);
      }, 1500); // Simulate loading time
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
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">Generating quiz questions...</p>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="text-center">
        <h3 className="text-xl font-bold mb-4">Quiz Complete!</h3>
        <p className="text-lg mb-3">Your Score: {score}/{questions.length}</p>
        <p className="mb-6">
          {score === questions.length
            ? "Perfect! You've mastered this section."
            : "Good effort! Review the paragraph again for better understanding."}
        </p>
        <button 
          onClick={handleRestart}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Retry Quiz
        </button>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Quiz: Question {currentQuestion + 1}/{questions.length}</h3>
      
      <p className="mb-4">{questions[currentQuestion].question}</p>
      
      <div className="space-y-3 mb-6">
        {questions[currentQuestion].options.map((option, index) => (
          <div 
            key={index}
            onClick={() => handleAnswerSelect(index)}
            className={`p-3 border rounded-md cursor-pointer
              ${selectedAnswer === index ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-50'}`}
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
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
      </button>
    </div>
  );
}
