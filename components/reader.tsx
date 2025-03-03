"use client";

import { useState, useEffect } from 'react';
import TextInput from './text-input';
import FileInput from './file-input';
import UrlInput from './url-input';
import Learn from './learn';
import SettingsBar, { Settings } from './settings-bar';
import LoadingPlaceholder from './loading-placeholder';

  const videoFiles = [
    '/videos/Snaptik.app_7344378689997606176.mp4',
    '/videos/Snaptik.app_7429790134733638944.mp4',
    '/videos/Snaptik.app_7470995966930210081.mp4',
    '/videos/Snaptik.app_7476200752214445344.mp4',
    '/videos/Snaptik.app_7405306228034866464.mp4',
    '/videos/Snaptik.app_7385259884704582945.mp4',
    '/videos/Snaptik.app_6956579273134050565.mp4',
    '/videos/Snaptik.app_6941757529101700358.mp4',
    '/videos/Snaptik.app_7476564407271705887.mp4',
    '/videos/Snaptik.app_7475187692179868959.mp4',
    '/videos/Snaptik.app_7473645213232205087.mp4',
    '/videos/Snaptik.app_7376035875978857760.mp4',
    '/videos/Snaptik.app_7256306326052162858.mp4',
    '/videos/Snaptik.app_7432376419998584097.mp4',
    '/videos/Snaptik.app_7261288061789621546.mp4',
    '/videos/Snaptik.app_7283898920722369825.mp4',
    '/videos/Snaptik.app_7131946147945418027.mp4',
    '/videos/Snaptik.app_7377430487498820897.mp4',
    '/videos/Snaptik.app_7320412622178880800.mp4',
    '/videos/Snaptik.app_7474390985477229870.mp4'
  ];

const randomVideo = videoFiles[Math.floor(Math.random() * videoFiles.length)];

interface Word {
  id: number;
  text: string;
  isBlank: boolean;
  originalWord?: string;
  submitted: boolean;
}

export default function Reader() {

  const [showVideo, setShowVideo] = useState(false); // State to control video visibility
  const [randomVideo, setRandomVideo] = useState<string>(''); // State for random video

  useEffect(() => {
    if (showVideo) {
      // Select a random video each time the video popup is opened
      const randomVideo = videoFiles[Math.floor(Math.random() * videoFiles.length)];
      setRandomVideo(randomVideo);
    }
  }, [showVideo]); // Trigger when showVideo state changes

  const toggleVideo = () => {
    setShowVideo(prev => !prev); // Toggle video visibility
  };

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
  // const [showVideo, setShowVideo] = useState(false); // State to control video visibility

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

  // const toggleVideo = () => {
  //   setShowVideo(!showVideo); // Toggle video visibility
  // };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${settings.darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className={`container mx-auto px-4 relative py-8 transition-opacity duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
        <SettingsBar 
          settings={settings} 
          onSettingsChange={setSettings}
          disabled={!!processedText || loading} 
        />
        
        {/* Add "Watch Video" button */}
        <div className="fixed top-6 right-20 z-80">
          <button 
            onClick={toggleVideo}
            className={`px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105 lucky-button
              ${settings.darkMode 
                ? 'bg-gradient-to-r from-pink-600 to-purple-700 hover:shadow-lg hover:shadow-blue-500/25' 
                : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:shadow-lg hover:shadow-blue-500/25'} 
              text-white relative overflow-hidden`}
          >
            Take a Break!
          </button>
        </div>

        {/* Conditionally render the video as a popup */}
        {showVideo && (
          <div className={`fixed inset-0 flex justify-center items-center z-50 
            ${settings.darkMode ? 'bg-gray-900 bg-opacity-80' : 'bg-gray-100 bg-opacity-80'}`}>
            <div className={`p-4 rounded-xl shadow-lg max-w-lg w-full h-[80vh] flex flex-col
              ${settings.darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
              <div className="relative flex-1 pb-[56.25%] overflow-hidden mb-4">
                <video
                  src={randomVideo} // Path to the randomly selected video
                  autoPlay
                  loop
                  className="absolute inset-0 w-full h-full"
                />
              </div>
              <button
                onClick={toggleVideo}
                className={`self-center mt-4 ${settings.darkMode ? 'text-red-500' : 'text-red-700'} hover:underline`}
              >
                Close Video
              </button>
            </div>
          </div>
        )}


        {/* Rest of the component */}
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
                  className={`px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105 lucky-button
                    ${settings.darkMode 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:shadow-lg hover:shadow-blue-500/25' 
                      : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:shadow-lg hover:shadow-blue-500/25'} 
                    text-white relative overflow-hidden`}
                >
                  <span className="relative z-10 flex items-center">
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