import { NextRequest, NextResponse } from 'next/server';
import { QuizRequest, QuizResponse, Question } from '../../../types';

import { ChatGroq } from "@langchain/groq";
import { env } from 'process';
import { z } from 'zod';

const llm = new ChatGroq({
  apiKey: env.GROQ_API_KEY,
  model: 'llama-3.3-70b-versatile',
  temperature: 0.5,
  maxTokens: 150,
});

const QuizQuestion = z.object({
  question: z.string().describe("Ask a question about paragraph. Make the question short and fairly trivially easy."),
  options: z.array(z.string()).length(4).describe("Four options to choose from. Make them all plausible, maybe words from the text? Whatever you want. Add one silly option."),
  correctAnswer: z.number().int().min(0).max(3).describe("Index of the correct answer in the options array."),
})

// const Quiz = z.object({
//   questions: z.array(QuizQuestion).describe("Array of quiz questions generated from the text."),
// })

const structured_llm = llm.withStructuredOutput(QuizQuestion);

async function generateQuizQuestion(paragraph: string) {
  const aiMsg = await structured_llm.invoke([
    {
      role: "system",
      content:
        "You are a helpful assistant that generates quiz questions. Generate a questions from the paragraph. Make it easy and trivial.",
    },
    { role: "user", content: paragraph },
  ]);
  return aiMsg
}

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json() as QuizRequest;
    
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Invalid input. Please provide text to generate quiz questions.' },
        { status: 400 }
      );
    }

    const question = await generateQuizQuestion(text);
    const questions = [question]
    
    return NextResponse.json({ questions } as QuizResponse);
  } catch (error) {
    console.error('Error generating quiz:', error);
    return NextResponse.json(
      { error: 'Failed to generate quiz questions' },
      { status: 500 }
    );
  }
}
