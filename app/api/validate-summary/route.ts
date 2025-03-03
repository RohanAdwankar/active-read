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
}).describe("Evaluation of the summary");

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

function validateMockSummary(originalText: string, userSummary: string): SummaryResponse {
  const originalLength = originalText.length;
  const summaryLength = userSummary.length;
  const ratio = summaryLength / originalLength;
  
  // Simple checks for demonstration purposes
  const isGoodLength = ratio >= 0.1 && ratio <= 0.5;
  const hasMeaningfulContent = summaryLength > 20;
  const isValid = isGoodLength && hasMeaningfulContent;
  
  let feedback = "";
  let score = 0;
  
  if (isValid) {
    // Generate positive feedback
    score = Math.floor(Math.random() * 30) + 70; // Random score between 70-100
    
    if (score >= 90) {
      feedback = "Excellent summary! You've captured the key points concisely while maintaining the core meaning of the original text.";
    } else if (score >= 80) {
      feedback = "Good summary! You've included most of the important points. Consider adding a bit more about the key implications mentioned in the text.";
    } else {
      feedback = "Decent summary that covers the basics. To improve, try focusing more on the main arguments rather than peripheral details.";
    }
  } else {
    // Generate constructive feedback
    score = Math.floor(Math.random() * 30) + 40; // Random score between 40-70
    
    if (summaryLength < 20) {
      feedback = "Your summary is too brief. Try to include more key points from the original text.";
    } else if (ratio > 0.5) {
      feedback = "Your summary is too long compared to the original. A good summary should be concise while capturing the main ideas.";
    } else {
      feedback = "Your summary needs improvement. Make sure to include the main points and key arguments from the text.";
    }
  }
  
  return {
    isValid,
    feedback,
    score
  };
}
