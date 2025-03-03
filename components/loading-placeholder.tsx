import React from 'react';

interface LoadingPlaceholderProps {
  darkMode?: boolean;
}

export default function LoadingPlaceholder({ darkMode = false }: LoadingPlaceholderProps) {
  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          <div className={`w-20 h-20 rounded-full border-4 border-t-transparent animate-spin
            ${darkMode ? 'border-blue-500' : 'border-blue-600'}`}></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-10 h-10 rounded-full 
              ${darkMode ? 'bg-blue-500' : 'bg-blue-600'} animate-pulse-slow`}></div>
          </div>
        </div>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <div className={`h-8 mb-6 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} w-3/4`}></div>
        
        {[...Array(5)].map((_, i) => (
          <div key={i} className="mb-4">
            <div className={`h-4 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} w-full mb-2`}></div>
            <div className={`h-4 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} w-5/6 mb-2`}></div>
            <div className={`h-4 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} w-4/6 mb-2`}></div>
            <div className={`h-4 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} w-3/4`}></div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center mt-8">
        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Fetching a random article...
        </div>
      </div>
    </div>
  );
}
