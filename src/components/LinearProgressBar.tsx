
import React, { useState, useEffect } from 'react';

interface LinearProgressBarProps {
  isLoading: boolean;
}

const LinearProgressBar = ({ isLoading }: LinearProgressBarProps) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  
  useEffect(() => {
    if (!isLoading) {
      setElapsedTime(0);
      return;
    }
    
    const intervalId = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [isLoading]);
  
  if (!isLoading) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-white border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
      </div>
      
      <p className="text-white/90 text-lg font-medium text-center mt-4 mb-6">
        Analyzing your document and generating canvas...
      </p>
      
      <div className="text-white/80 text-sm font-medium">
        <div>Processing time: {formatTime(elapsedTime)}</div>
      </div>
    </div>
  );
};

export default LinearProgressBar;
