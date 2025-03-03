"use client";

import { useState, useRef, useEffect } from 'react';

interface ChatProps {
  context: string;
  darkMode?: boolean;
}

interface Message {
  id: number;
  type: 'user' | 'assistant';
  content: string;
}

export default function Chat({ context, darkMode = false }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: input
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: {role: "user", content: input},
          context: context,
          history: messages
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response');
      }
      
      const data = await response.json();
      
      const assistantMessage: Message = {
        id: Date.now() + 1,
        type: 'assistant',
        content: data.reply
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error chatting with AI:', error);
      
      const errorMessage: Message = {
        id: Date.now() + 1,
        type: 'assistant',
        content: "I'm sorry, I couldn't process your request. Please try again."
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className={`flex-1 overflow-y-auto mb-4 p-4 rounded-md ${
        darkMode ? 'bg-gray-700 border border-gray-600' : 'bg-gray-50 border border-gray-200'
      }`}
        style={{ maxHeight: '280px', minHeight: '200px' }}
      >
        {messages.length === 0 ? (
          <div className={`text-center py-8 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
            <p>Ask questions about what you're reading.</p>
            <p className="text-xs mt-2">Examples:</p>
            <ul className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <li>"Can you explain this concept?"</li>
              <li>"What does this paragraph mean?"</li>
              <li>"Why is this important?"</li>
            </ul>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 p-3 rounded-lg ${
                message.type === 'user'
                  ? darkMode
                    ? 'bg-blue-800 text-blue-50 ml-4'
                    : 'bg-blue-100 text-blue-900 ml-4'
                  : darkMode
                    ? 'bg-gray-800 text-gray-100 mr-4'
                    : 'bg-white text-gray-800 mr-4 shadow-sm border border-gray-100'
              }`}
            >
              <div className={`font-medium text-xs mb-1 ${
                message.type === 'user'
                  ? darkMode ? 'text-blue-200' : 'text-blue-700'
                  : darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {message.type === 'user' ? 'You' : 'Assistant'}
              </div>
              <div className="text-sm whitespace-pre-wrap">{message.content}</div>
            </div>
          ))
        )}
        {loading && (
          <div className={`mr-auto ${
            darkMode ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-800'
          } rounded-lg p-3`}>
            <div className="flex space-x-1">
              <div className={`w-2 h-2 ${darkMode ? 'bg-gray-500' : 'bg-gray-400'} rounded-full animate-bounce`}></div>
              <div className={`w-2 h-2 ${darkMode ? 'bg-gray-500' : 'bg-gray-400'} rounded-full animate-bounce`} style={{animationDelay: '0.2s'}}></div>
              <div className={`w-2 h-2 ${darkMode ? 'bg-gray-500' : 'bg-gray-400'} rounded-full animate-bounce`} style={{animationDelay: '0.4s'}}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2 relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={`w-full p-2 rounded-md border text-sm ${
            darkMode
              ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              : 'bg-white border-gray-300 text-gray-900 focus:border-blue-400 focus:ring-1 focus:ring-blue-400'
          }`}
          placeholder="Ask a question..."
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className={`absolute right-1 top-1 bottom-1 px-2 rounded-md ${
            darkMode
              ? 'bg-blue-600 hover:bg-blue-500 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          } ${loading || !input.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </form>
    </div>
  );
}
