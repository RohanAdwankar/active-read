import { NextRequest, NextResponse } from 'next/server';
import { SummaryRequest, SummaryResponse } from '../../../types';

import { ChatGroq } from "@langchain/groq";
import { env } from 'process';
import { z } from 'zod';

const llm = new ChatGroq({
  apiKey: env.GROQ_API_KEY,
  model: 'llama-3.3-70b-versatile',
  temperature: 0.5,
  maxTokens: 150,
});

const Evaluation = z.object({
  isValid: z.boolean().describe("Is the summary valid? i.e., is it relevant and at least a sentnece long?"),
  feedback: z.string().describe("Feedback on the summary"),
  score: z.number().describe("Score, 0-100, but if its like horrible give a negative score and can go above 100 if its like the most amazing thing"),
}).describe("Evaluation of the summary. YOUR FEEDBACK MUST ONLY BE ONE SENTENCE.");

const structured_llm = llm.withStructuredOutput(Evaluation);

async function askAI(prompt: string) {
  const aiMsg = await structured_llm.invoke([
    {
      role: "system",
      content:
        "You are a helpful assistant that evaluates summarys. Evaluate for accuracy, comprehension, and conciseness.",
    },
    { role: "user", content: prompt },
  ]);
  // console.log(aiMsg);
  return aiMsg
  // return aiMsg.content;
}

export async function POST(req: NextRequest) {
  try {
    const { originalText, userSummary } = await req.json() as SummaryRequest;

    // console.log("API Key:", env.GROQ_API_KEY);
    
    if (!originalText || !userSummary) {
      return NextResponse.json(
        { error: 'Missing required fields: originalText and userSummary' },
        { status: 400 }
      );
    }

    // In a real implementation:
    // 1. Embed both the original text and summary
    // 2. Use LLM to compare summary to original text
    // 3. Evaluate for completeness, accuracy, and conciseness
    
    // Placeholder: Validate summary based on simple heuristics
    // const result = validateMockSummary(originalText, userSummary);
    const result = await askAI(
      `Evaluate the following summary of the text: "${originalText}". The summary is: "${userSummary}". Provide feedback on its validity, completeness, and conciseness.`
    );
    // const result = {
    //   isValid: true,
    //   feedback: promptResponse,
    //   score: Math.floor(Math.random() * 100), // Placeholder for actual score
    // }
    // console.log("AI Result:", result);

    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error validating summary:', error);
    return NextResponse.json(
      { error: 'Failed to validate summary' },
      { status: 500 }
    );
  }
}