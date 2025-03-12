
import React, { useEffect, useState } from 'react';

interface LinearProgressBarProps {
  isLoading: boolean;
  duration?: number; // in milliseconds
}

const LinearProgressBar = ({ isLoading, duration = 10000 }: LinearProgressBarProps) => {
  const [progress, setProgress] = useState(0);
  const [animationStarted, setAnimationStarted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let progressInterval: NodeJS.Timeout | null = null;
    let timeInterval: NodeJS.Timeout | null = null;
    
    if (isLoading && !animationStarted) {
      // Reset values when loading starts
      setAnimationStarted(true);
      setProgress(0);
      setElapsedTime(0);
      
      const startTime = Date.now();
      
      // Set up progress interval
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev < 100) {
            return prev + 1;
          } else {
            if (progressInterval) clearInterval(progressInterval);
            return 100;
          }
        });
      }, duration / 100);
      
      // Set up time interval
      timeInterval = setInterval(() => {
        const currentTime = Date.now();
        const elapsed = Math.floor((currentTime - startTime) / 1000);
        setElapsedTime(elapsed);
      }, 1000);
    }
    
    if (!isLoading && animationStarted) {
      setAnimationStarted(false);
      setProgress(0);
      setElapsedTime(0);
    }
    
    // Clean up intervals
    return () => {
      if (progressInterval) clearInterval(progressInterval);
      if (timeInterval) clearInterval(timeInterval);
    };
  }, [isLoading, animationStarted, duration]);

  if (!isLoading && !animationStarted) return null;

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="relative w-full max-w-[600px] mb-8">
        <div className="loader-container relative h-6 w-full rounded-md overflow-hidden">
          {/* Gradient background - always visible */}
          <div 
            className="absolute inset-0 bg-gradient-to-r from-blue-400 to-red-500 shadow-inner"
          ></div>
          
          {/* Black overlay that slides right to left as progress increases */}
          <div 
            className="absolute inset-0 bg-black/80"
            style={{ 
              width: `${100 - progress}%`, 
              right: 0, 
              left: 'auto',
              borderTopLeftRadius: progress === 100 ? 0 : '0.375rem',
              borderBottomLeftRadius: progress === 100 ? 0 : '0.375rem',
            }}
          ></div>
          
          {/* Progress dot */}
          <div 
            className="absolute top-1/2 w-4 h-4 rounded-full bg-white shadow-md"
            style={{ 
              left: `${progress}%`,
              transform: 'translate(-50%, -50%)',
            }}
          ></div>
          
          {/* Progress percentage */}
          <div 
            className="absolute top-0 right-8 text-2xl font-bold text-white"
            style={{ 
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
