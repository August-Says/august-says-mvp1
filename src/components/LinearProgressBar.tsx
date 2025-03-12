
import React, { useEffect, useState } from 'react';

interface LinearProgressBarProps {
  isLoading: boolean;
  duration?: number; // in milliseconds
}

const LinearProgressBar = ({ isLoading, duration = 10000 }: LinearProgressBarProps) => {
  const [progress, setProgress] = useState(0);
  const [animationStarted, setAnimationStarted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    let timeInterval: NodeJS.Timeout;
    
    if (isLoading && !animationStarted) {
      setAnimationStarted(true);
      setProgress(0);
      setElapsedTime(0);
      setStartTime(Date.now());
      
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev < 100) {
            return prev + 1;
          } else {
            clearInterval(progressInterval);
            return 100;
          }
        });
      }, duration / 100);
      
      timeInterval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - (startTime || Date.now())) / 1000));
      }, 1000);
    }
    
    if (!isLoading) {
      setAnimationStarted(false);
      setProgress(0);
      setElapsedTime(0);
      setStartTime(null);
    }
    
    return () => {
      clearInterval(progressInterval);
      clearInterval(timeInterval);
    };
  }, [isLoading, animationStarted, duration, startTime]);

  if (!isLoading && !animationStarted) return null;

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="relative w-full max-w-[600px] mb-8">
        <div className="loader-container relative h-6 w-full rounded-md overflow-hidden">
          {/* Colorful background gradient that's always visible */}
          <div 
            className="absolute inset-0 bg-gradient-to-r from-blue-400 to-red-500 shadow-inner"
          ></div>
          
          {/* Black overlay that covers the progress and moves from right to left */}
          <div 
            className="absolute inset-0 bg-gradient-to-b from-black to-gray-800"
            style={{ 
              width: `${100 - progress}%`, 
              right: 0, 
              borderTopLeftRadius: progress === 100 ? 0 : '0.375rem',
              borderBottomLeftRadius: progress === 100 ? 0 : '0.375rem',
              transition: 'width 0.3s ease-out'
            }}
          ></div>
          
          {/* Progress dot at the end of the visible colored section */}
          <div 
            className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full bg-black"
            style={{ 
              left: `${progress}%`,
              transform: 'translate(-50%, -50%)',
              transition: 'left 0.3s ease-out'
            }}
          ></div>
          
          {/* Progress percentage */}
          <div 
            className="absolute top-0 right-8 text-2xl font-bold text-white"
            style={{ 
              transition: 'color 0.5s ease',
              textShadow: '0 2px 4px rgba(0,0,0,0.5)'
            }}
          >
            {progress}%
          </div>
        </div>
      </div>
      
      <p className="text-white/90 text-lg font-medium text-center mb-6">
        Analyzing your document and generating canvas...
      </p>
      
      <div className="text-white/80 text-sm font-medium flex flex-col items-center gap-2">
        <div>Please wait while we process your request</div>
        <div className="text-lg font-semibold text-blue-300">
          Time elapsed: {elapsedTime} seconds
        </div>
      </div>
    </div>
  );
};

export default LinearProgressBar;
