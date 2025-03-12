
import React, { useEffect, useState } from 'react';

interface LinearProgressBarProps {
  isLoading: boolean;
  duration?: number; // in milliseconds
}

const LinearProgressBar = ({ isLoading, duration = 10000 }: LinearProgressBarProps) => {
  const [progress, setProgress] = useState(0);
  const [animationStarted, setAnimationStarted] = useState(false);

  useEffect(() => {
    if (isLoading && !animationStarted) {
      setAnimationStarted(true);
      setProgress(0);
      
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev < 100) {
            return prev + 1;
          } else {
            clearInterval(interval);
            return 100;
          }
        });
      }, duration / 100);
      
      return () => {
        clearInterval(interval);
      };
    }
    
    if (!isLoading) {
      setAnimationStarted(false);
      setProgress(0);
    }
  }, [isLoading, animationStarted, duration]);

  if (!isLoading && !animationStarted) return null;

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="relative w-full max-w-[600px] mb-8">
        <div className="loader-container relative h-6 w-full rounded-md overflow-hidden">
          {/* Colorful background gradient */}
          <div 
            className="absolute inset-0 bg-gradient-to-r from-blue-400 to-red-500 shadow-inner"
          ></div>
          
          {/* Animated dark overlay that moves from right to left */}
          <div 
            className="runner absolute inset-0 bg-gradient-to-b from-black to-gray-800"
            style={{ 
              width: `${100 - progress}%`, 
              right: 0, 
              borderTopLeftRadius: progress === 100 ? 0 : '0.375rem',
              borderBottomLeftRadius: progress === 100 ? 0 : '0.375rem',
              transition: 'width 0.3s ease-out'
            }}
          ></div>
          
          {/* Progress dot at the end of the bar */}
          <div 
            className={`absolute top-1/2 transform -translate-y-1/2 right-0 w-4 h-4 rounded-full bg-gradient-to-b from-black to-gray-800 ${progress === 100 ? 'bg-red-500' : ''}`}
            style={{ 
              right: `${progress === 100 ? '0' : 'calc(' + (100 - progress) + '% - 0.5rem)'}`,
              transition: 'right 0.3s ease-out'
            }}
          ></div>
          
          {/* Progress percentage */}
          <div 
            className={`meter absolute top-0 right-8 text-2xl font-bold ${progress < 50 ? 'text-blue-400' : 'text-red-500'}`}
            style={{ 
              transition: 'color 0.5s ease',
              textShadow: '0 -1px 0 rgba(0,0,0,0.5)'
            }}
          >
            {progress}%
          </div>
        </div>
      </div>
      
      <p className="text-white/90 text-lg font-medium text-center mb-6">
        Analyzing your document and generating canvas...
      </p>
      
      <div className="text-white/80 text-sm font-medium">
        Please wait while we process your request
      </div>
    </div>
  );
};

export default LinearProgressBar;
