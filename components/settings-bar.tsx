"use client";

import { useState, useRef, useEffect } from 'react';

export interface Settings {
  blankFrequency: number;  // percentage of candidate words to remove (5-30%)
}

interface SettingsBarProps {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
  visible?: boolean;
}

export default function SettingsBar({ settings, onSettingsChange, visible = true }: SettingsBarProps) {
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
  
  if (!visible) return null;
  
  return (
    <div className="relative">
      {/* Gear icon button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 right-6 z-10 bg-white p-3 rounded-full shadow-md hover:bg-gray-50"
        aria-label="Settings"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      </button>
      
      {/* Settings popup */}
      {isOpen && (
        <div 
          ref={popupRef}
          className="fixed top-16 right-6 z-20 w-72 bg-white rounded-lg shadow-lg p-4 border border-gray-200"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Exercise Settings</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
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
                className="flex-grow h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm">30%</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Higher values create more challenging exercises with more words removed
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
