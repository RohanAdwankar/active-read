'use server'
import { NextRequest, NextResponse } from 'next/server';
import { ChatRequest, ChatResponse, Message } from '../../../types';

export async function POST(req: NextRequest) {
  try {
    const { messages, context } = await req.json() as ChatRequest;
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or empty messages array' },
        { status: 400 }
      );
    }
    
    // Get the last user message
    const lastUserMessage = messages.filter(msg => msg.role === 'user').pop();
    
    if (!lastUserMessage) {
      return NextResponse.json(
        { error: 'No user message found' },
        { status: 400 }
      );
    }

    // In a real implementation:
    // 1. Embed the chat context/history and user query
    // 2. Use RAG to retrieve relevant context from the original text
    // 3. Generate response using LLM with the context
    
    // Placeholder: Generate response based on message content
    const responseMessage = generateMockResponse(lastUserMessage.content, context, messages);
    
    return NextResponse.json({ 
      message: responseMessage 
    } as ChatResponse);
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}

function generateMockResponse(query: string, context?: string, messages?: Message[]): Message {
  // Sample responses based on question keywords
  const responses: Record<string, string[]> = {
    'what': [
      "Based on the text, this concept refers to a structured approach to understanding the underlying principles.",
      "The text explains this as a multi-faceted phenomenon with several key characteristics that interact in complex ways.",
      "According to the passage, this represents an evolution in thinking about how systems operate under different conditions."
    ],
    'why': [
      "The text suggests this happens because of the interplay between various factors in the system.",
      "According to the passage, this occurs due to fundamental principles that govern how these elements interact.",
      "The author explains this as a consequence of historical developments and theoretical advances in the field."
    ],
    'how': [
      "The process works through a series of interconnected steps, where each builds upon the previous one.",
      "The text describes this as functioning through feedback loops that reinforce certain patterns while inhibiting others.",
      "According to the passage, this operates by establishing connections between seemingly disparate elements."
    ],
    'define': [
      "The text defines this as a systematic approach to understanding complex phenomena through careful analysis.",
      "According to the passage, this can be understood as a framework for examining relationships between different variables.",
      "The author describes this as a paradigm that has evolved considerably over time as new evidence has emerged."
    ]
  };
  
  // Look for keywords in the query
  let responseArray = responses['what']; // Default
  for (const [keyword, responseOptions] of Object.entries(responses)) {
    if (query.toLowerCase().includes(keyword)) {
      responseArray = responseOptions;
      break;
    }
  }
  
  // If we have context, mention it
  const contextPrefix = context ? "Based on the text you're reading, " : "";
  
  // Select a random response from the appropriate category
  const randomIndex = Math.floor(Math.random() * responseArray.length);
  const responseContent = contextPrefix + responseArray[randomIndex];
  
  return {
    role: 'assistant',
    content: responseContent
  };
}
