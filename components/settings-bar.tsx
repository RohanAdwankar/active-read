"use client";

import { useState, useRef, useEffect } from 'react';

export interface Settings {
  blankFrequency: number;  // percentage of candidate words to remove (5-30%)
  onlyImportantWords: boolean;  // toggle to control whether to filter out common/short words
  dyslexicFont: boolean;  // toggle to control whether to use the OpenDyslexic font
  darkMode: boolean;  // toggle for dark/light mode
}

interface SettingsBarProps {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
  visible?: boolean;
  disabled?: boolean; 
}

export default function SettingsBar({ settings, onSettingsChange, visible = true, disabled = false }: SettingsBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  
  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (settings?.dyslexicFont) {
      document.body.classList.add("dyslexic-font");
    } else {
      document.body.classList.remove("dyslexic-font");
    }
  }, [settings?.dyslexicFont]);
  
  // Apply dark mode theme
  useEffect(() => {
    if (settings?.darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [settings?.darkMode]);
  
  if (!visible) return null;
  
  return (
    <div className="relative">
      {/* Gear icon button with glass morphism effect */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-6 right-6 z-10 p-3 rounded-full 
          backdrop-blur-md bg-opacity-70 shadow-lg transition-all duration-300 hover:shadow-blue-500/20 
          ${settings.darkMode ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
        aria-label="Settings"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform duration-300 hover:rotate-90" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      </button>
      
      {/* Settings popup with glass morphism */}
      {isOpen && (
        <div 
          ref={popupRef}
          className={`fixed top-16 right-6 z-20 w-80 rounded-xl shadow-2xl backdrop-blur-lg p-5 border animate-fadeIn
            ${settings.darkMode 
              ? 'bg-gray-800/95 border-gray-700 text-gray-100' 
              : 'bg-white/95 border-gray-200 text-gray-800'}`}
        >
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-medium text-lg">Settings</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Dark Mode Toggle */}
          <div className={`flex items-center justify-between mb-6`}>
            <div>
              <label className="block text-sm font-medium" htmlFor="toggle-theme">
                {settings.darkMode ? 'Dark Mode' : 'Light Mode'}
              </label>
              <p className={`text-xs ${settings.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Toggle between dark and light theme
              </p>
            </div>
            <div className="relative inline-block w-12 align-middle select-none">
              <input 
                type="checkbox"
                checked={settings.darkMode}
                onChange={(e) => {
                  onSettingsChange({
                    ...settings,
                    darkMode: e.target.checked
                  });
                }}
                id="toggle-theme"
                className="sr-only"
              />
              <label 
                htmlFor="toggle-theme"
                className={`flex items-center w-12 h-6 rounded-full cursor-pointer transition-colors duration-300 ease-in-out
                  ${settings.darkMode ? 'bg-blue-600' : 'bg-gray-300'}`}
              >
                <div className="flex justify-between w-full px-1">
                  <span className={`${settings.darkMode ? 'text-blue-100' : 'opacity-0'} text-xs`}>🌙</span>
                  <span className={`${!settings.darkMode ? 'text-yellow-500' : 'opacity-0'} text-xs`}>☀️</span>
                </div>
                <span 
                  className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full shadow transform transition-transform duration-300
                    ${settings.darkMode ? 'translate-x-6' : 'translate-x-0'}`} 
                />
              </label>
            </div>
          </div>
          
          <div className={`mb-6 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
            <label className="block text-sm font-medium mb-1">
              Word Removal Frequency: {settings.blankFrequency}%
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm">5%</span>
              <input 
                type="range" 
                min="5" 
                max="30" 
                value={settings.blankFrequency}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  onSettingsChange({
                    ...settings,
                    blankFrequency: value
                  });
                }}
                disabled={disabled}
                className={`flex-grow h-2 rounded-lg appearance-none cursor-pointer 
                  ${settings.darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
              />
              <span className="text-sm">30%</span>
            </div>
            <p className={`text-xs mt-1 ${settings.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Higher values create more challenging exercises
            </p>
          </div>
          
          <div className={`flex items-center justify-between mb-6 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
            <div>
              <label className="block text-sm font-medium" htmlFor="toggle-important">
                Only Blank Important Words
              </label>
              <p className={`text-xs ${settings.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Removes only longer, non-common words
              </p>
            </div>
            <div className="relative inline-block w-12 align-middle select-none">
              <input 
                type="checkbox"
                checked={settings.onlyImportantWords}
                onChange={(e) => {
                  onSettingsChange({
                    ...settings,
                    onlyImportantWords: e.target.checked
                  });
                }}
                disabled={disabled}
                id="toggle-important"
                className="sr-only"
              />
              <label 
                htmlFor="toggle-important"
                className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-300
                  ${settings.onlyImportantWords ? 'bg-blue-600' : settings.darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}
              >
                <span 
                  className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-300
                    ${settings.onlyImportantWords ? 'translate-x-6' : 'translate-x-0'}`} 
                />
              </label>
            </div>
          </div>

          <div className={`flex items-center justify-between mb-3`}>
            <div>
              <label className="block text-sm font-medium" htmlFor="toggle-dyslexic">
                Dyslexic Font
              </label>
              <p className={`text-xs ${settings.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Use OpenDyslexic for better readability
              </p>
            </div>
            <div className="relative inline-block w-12 align-middle select-none">
              <input 
                type="checkbox"
                checked={settings.dyslexicFont}
                onChange={(e) => {
                  onSettingsChange({
                    ...settings,
                    dyslexicFont: e.target.checked
                  });
                }}
                id="toggle-dyslexic"
                className="sr-only"
              />
              <label 
                htmlFor="toggle-dyslexic"
                className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-300
                  ${settings.dyslexicFont ? 'bg-blue-600' : settings.darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}
              >
                <span 
                  className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-300
                    ${settings.dyslexicFont ? 'translate-x-6' : 'translate-x-0'}`} 
                />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
