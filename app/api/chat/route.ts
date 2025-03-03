'use server'
import { NextRequest, NextResponse } from 'next/server';
import { ChatRequest, ChatResponse, Message } from '../../../types';


import { ChatGroq } from "@langchain/groq";
import { env } from 'process';

const llm = new ChatGroq({
  apiKey: env.GROQ_API_KEY,
  model: 'llama-3.3-70b-versatile',
  temperature: 0.5,
  maxTokens: 150,
});

async function askAI(prompt: string, context: string) {
  const aiMsg = await llm.invoke([
    {
      role: "system",
      content:
        "You are a helpful assistant that answers questions based on the text. The text will be provided to you below. Answer the question based on the text. If you don't know, say 'I don't know'. Answer in short concise sentences. Say max 3 sentences.",
    },
    {
      role: "system",
      content: context
    },
    { role: "user", content: prompt },
  ]);
  return aiMsg.content.toString();
}

export async function POST(req: NextRequest) {
  try {
    const { message, context, history } = await req.json() as ChatRequest;
    console.log(message)
    if (!message || !message.content || message.content.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or empty messages array' },
        { status: 400 }
      );
    }
    
    const responseMessage = await askAI(
      message.content,
      context
    );
    console.log(responseMessage);
    
    return NextResponse.json({ 
      message: {role: "assistant", content: responseMessage} 
    } as ChatResponse);
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
