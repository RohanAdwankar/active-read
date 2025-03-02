import { NextRequest, NextResponse } from 'next/server';
import { QuizRequest, QuizResponse, Question } from '../../../types';

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json() as QuizRequest;
    
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Invalid input. Please provide text to generate quiz questions.' },
        { status: 400 }
      );
    }

    // In a real implementation:
    // 1. Embed the text using an embedding model
    // 2. Store in vector DB or use directly
    // 3. Generate quiz questions using LLM with the context
    
    // Placeholder: Generate mock questions based on text length
    const questions = generateMockQuestions(text);
    
    return NextResponse.json({ questions } as QuizResponse);
  } catch (error) {
    console.error('Error generating quiz:', error);
    return NextResponse.json(
      { error: 'Failed to generate quiz questions' },
      { status: 500 }
    );
  }
}

function generateMockQuestions(text: string): Question[] {
  // Generate different questions based on the text to simulate dynamic content
  // In reality, we'd use the text content to inform the questions
  const textLength = text.length;
  const wordCount = text.split(/\s+/).length;
  
  const questionTemplates: Question[] = [
    {
      question: `Based on the paragraph with approximately ${wordCount} words, what would be the most likely conclusion?`,
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
  
  // Add additional dynamic question based on text characteristics
  if (textLength > 500) {
    questionTemplates.push({
      question: "What would be the best title for this longer paragraph?",
      options: [
        "Understanding Complex Systems",
        "Historical Perspectives on the Topic",
        "A New Approach to Problem Solving",
        "Comparing Theoretical Models"
      ],
      correctAnswer: 0
    });
  }
  
  return questionTemplates;
}
