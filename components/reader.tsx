"use client";

import { useState, useEffect } from 'react';
import TextInput from './text-input';
import FileInput from './file-input';
import UrlInput from './url-input';
import Learn from './learn';
import SettingsBar, { Settings } from './settings-bar';
import LoadingPlaceholder from './loading-placeholder';

interface Word {
  id: number;
  text: string;
  isBlank: boolean;
  originalWord?: string;
  submitted: boolean;
}

export default function Reader() {
  const [processedText, setProcessedText] = useState<Word[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    blankFrequency: 15,
    onlyImportantWords: true,
    dyslexicFont: false,
    darkMode: false
  });
  const [title, setTitle] = useState<string>("Active Reader");
  const [fadeIn, setFadeIn] = useState(false);

  // Load saved settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('reader-settings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
      } catch (e) {
        console.error('Failed to parse saved settings');
      }
    } else {
      // Check system preference for dark mode
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setSettings(s => ({ ...s, darkMode: prefersDark }));
    }
    
    // Trigger fade-in animation
    setTimeout(() => setFadeIn(true), 100);
  }, []);
  
  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('reader-settings', JSON.stringify(settings));
  }, [settings]);

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
    // Trigger fade-in animation on return to main screen
    setFadeIn(false);
    setTimeout(() => setFadeIn(true), 100);
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${settings.darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className={`container mx-auto px-4 relative py-8 transition-opacity duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
        <SettingsBar 
          settings={settings} 
          onSettingsChange={setSettings}
          disabled={!!processedText || loading} 
        />
        
        {!processedText && !loading && (
          <div className="animate-fadeIn">
            <div className="text-center mb-10">
              <h1 className={`text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r 
                ${settings.darkMode ? 'from-blue-400 to-indigo-600' : 'from-blue-600 to-indigo-800'}`}>
                Active Reader
              </h1>
              <p className={`text-lg ${settings.darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto mb-2`}>
                Improve your reading comprehension with interactive exercises.
              </p>
              <p className={`text-md ${settings.darkMode ? 'text-gray-400' : 'text-gray-500'} max-w-2xl mx-auto`}>
                Paste text, upload a file, or enter a URL to get started.
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 transform transition-transform duration-300 hover:scale-[1.02]">
                  <div className={`h-full rounded-xl p-6 shadow-lg backdrop-blur-sm
                    ${settings.darkMode 
                      ? 'bg-gray-800/80 border border-gray-700 hover:border-blue-700' 
                      : 'bg-white/80 border border-gray-100 hover:border-blue-300'}`}>
                    <h2 className={`text-xl font-semibold mb-4 flex items-center
                      ${settings.darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Copy & Paste Text
                    </h2>
                    <TextInput onTextSubmit={handleTextSubmit} compact={true} darkMode={settings.darkMode} />
                  </div>
                </div>
                
                <div className="flex-1 transform transition-transform duration-300 hover:scale-[1.02]">
                  <div className={`h-full rounded-xl p-6 shadow-lg backdrop-blur-sm
                    ${settings.darkMode 
                      ? 'bg-gray-800/80 border border-gray-700 hover:border-blue-700' 
                      : 'bg-white/80 border border-gray-100 hover:border-blue-300'}`}>
                    <h2 className={`text-xl font-semibold mb-4 flex items-center
                      ${settings.darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      Upload a File
                    </h2>
                    <FileInput onTextSubmit={handleTextSubmit} compact={true} darkMode={settings.darkMode} />
                  </div>
                </div>
                
                <div className="flex-1 transform transition-transform duration-300 hover:scale-[1.02]">
                  <div className={`h-full rounded-xl p-6 shadow-lg backdrop-blur-sm
                    ${settings.darkMode 
                      ? 'bg-gray-800/80 border border-gray-700 hover:border-blue-700' 
                      : 'bg-white/80 border border-gray-100 hover:border-blue-300'}`}>
                    <h2 className={`text-xl font-semibold mb-4 flex items-center
                      ${settings.darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      From URL
                    </h2>
                    <UrlInput onTextSubmit={handleTextSubmit} compact={true} darkMode={settings.darkMode} />
                  </div>
                </div>
              </div>

              <div className="text-center mt-12">
                <button 
                  onClick={handleFeelingLucky}
                  className={`px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105
                    ${settings.darkMode 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white' 
                      : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white'}`}
                >
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    I'm feeling lucky
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
        
        {loading && (
          <LoadingPlaceholder darkMode={settings.darkMode} />
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
    </div>
  );
}

// Find the section of code that creates the processedText array and update it
function processText(text: string, blankFrequency: number): Word[] {
  // Split text into words while preserving whitespace and punctuation
  const regex = /(\s+|[,.!?;:]|[^\s,.!?;:]+)/g;
  const tokens = text.match(regex) || [];
  
  let wordIndex = 0;
  let id = 0;
  const processedWords: Word[] = [];
  
  tokens.forEach((token) => {
    // Ignore empty tokens
    if (!token) return;
    
    const isWord = /\w+/.test(token);
    const isBlank = isWord && 
      Math.random() < (blankFrequency / 100) && 
      token.length > 3; // Only blank out words longer than 3 chars
    
    processedWords.push({
      id: id++,
      text: isBlank ? '_'.repeat(token.length) : token,
      isBlank: isBlank,
      originalWord: isBlank ? token : undefined,
      submitted: false
    });
    
    if (isWord) wordIndex++;
  });
  
  return processedWords;
}
