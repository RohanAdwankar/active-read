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
    blankFrequency: 15, // default 15%
    onlyImportantWords: true // default to only removing important words
  });
  const [title, setTitle] = useState<string>("Active Reader");

  const handleTextSubmit = async (text: string, _title: string = "Active Reader") => {
    setLoading(true);
    try {
      const response = await fetch('/api/process-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text, 
          blankFrequency: settings.blankFrequency,
          onlyImportantWords: settings.onlyImportantWords 
        }),
      });
      setTitle(_title);
      
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

  const handleFeelingLucky = async () => {
    setLoading(true);
    // fetch random Wikipedia article from /api/feeling-lucky
    try {
      const response = await fetch('/api/feeling-lucky', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) throw new Error('Failed to fetch random article');
      
      const result = await response.json();
      handleTextSubmit(result.content, result.title);
      setTitle(result.title);
    } catch (error) {
      console.error('Error fetching random article:', error);
      alert('Failed to fetch random article. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const handleReset = () => {
    setProcessedText(null);
  };

  return (
    <div className="container mx-auto px-4 relative">
      {/* Settings gear icon - now with disabled state */}
      <SettingsBar 
        settings={settings} 
        onSettingsChange={setSettings}
        disabled={!!processedText || loading} 
      />
      
      {!processedText && !loading && (
        <div>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Reader</h1>
            <p className="text-gray-600">Improve your reading comprehension with interactive exercises.</p>
            <p className="text-gray-600">Paste text, upload a file, or enter a URL to get started.</p>
          </div>

          <div className="max-w-5xl mx-auto">
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

            <br />
            <div className="text-center">
              <button onClick={handleFeelingLucky}>I'm feeling lucky</button>
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
          pageTitle={title}
        />
      )}
    </div>
  );
}
