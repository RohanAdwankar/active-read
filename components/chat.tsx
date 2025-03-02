"use client";

import { useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi there! I can help you better understand what you\'re reading. Ask me anything about the text or concepts you\'re not sure about.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage: Message = { role: 'user', content: input };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setLoading(true);
    
    // Simulate response delay
    setTimeout(() => {
      const mockResponses = [
        "That's an interesting question about the text. Based on the content, I'd say the main idea revolves around how people interpret information differently based on their prior knowledge.",
        "Good question! The text is exploring the relationship between theory and practice in this domain. It suggests that practical applications often reveal gaps in theoretical models.",
        "I understand your confusion. This paragraph is describing a complex process, but essentially it means that learning happens in stages, with each new piece of information building on previous understanding.",
        "That's a great observation! The author is indeed making a comparison between different approaches to problem-solving. The first approach emphasizes analysis while the second focuses more on intuition."
      ];
      
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      const botMessage: Message = { role: 'assistant', content: randomResponse };
      
      setMessages(prevMessages => [...prevMessages, botMessage]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-300px)] max-h-[500px]">
      <div className="flex-grow overflow-y-auto mb-4 space-y-4 p-1">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`${
              message.role === 'user' ? 'ml-auto bg-blue-100' : 'mr-auto bg-gray-100'
            } rounded-lg p-3 max-w-[90%]`}
          >
            {message.content}
          </div>
        ))}
        {loading && (
          <div className="mr-auto bg-gray-100 rounded-lg p-3">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
            </div>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about the text..."
          className="flex-grow p-2 border rounded-md"
        />
        <button 
          type="submit"
          disabled={loading}
          className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </form>
    </div>
  );
}
