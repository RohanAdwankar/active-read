"use client";

import { useState } from 'react';
import TextInput from './text-input';
import FileInput from './file-input';
import UrlInput from './url-input';
import Learn from './learn';
import SettingsBar, { Settings } from './settings-bar';

interface Word {
  id: number;
  text: string;
  isBlank: boolean;
  originalWord?: string;
}

export default function Reader() {
  const [processedText, setProcessedText] = useState<Word[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    blankFrequency: 15 // default 15%
  });
  
  const handleTextSubmit = async (text: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/process-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text, 
          blankFrequency: settings.blankFrequency 
        }),
      });
      
      if (!response.ok) throw new Error('Failed to process text');
      
      const result = await response.json();
      setProcessedText(result.processedText);
    } catch (error) {
      console.error('Error processing text:', error);
      alert('Failed to process text. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setProcessedText(null);
  };

  return (
    <div className="container mx-auto px-4 relative">
      {/* Settings gear icon - always visible */}
      <SettingsBar 
        settings={settings} 
        onSettingsChange={setSettings} 
      />
      
      {!processedText && !loading && (
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">Active Reading Exercise</h1>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <div className="bg-white p-6 rounded-lg shadow-md h-full">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  Copy & Paste Text
                </h2>
                <TextInput onTextSubmit={handleTextSubmit} compact={true} />
              </div>
            </div>
            
            <div className="flex-1">
              <div className="bg-white p-6 rounded-lg shadow-md h-full">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  Upload a File
                </h2>
                <FileInput onTextSubmit={handleTextSubmit} compact={true} />
              </div>
            </div>
            
            <div className="flex-1">
              <div className="bg-white p-6 rounded-lg shadow-md h-full">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  From URL
                </h2>
                <UrlInput onTextSubmit={handleTextSubmit} compact={true} />
              </div>
            </div>
          </div>
        </div>
      )}
      
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {processedText && !loading && (
        <Learn 
          processedText={processedText}
          onBack={handleReset}
          settings={settings}
        />
      )}
    </div>
  );
}
