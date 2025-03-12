
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface LinearProgressBarProps {
  isLoading: boolean;
}

const LinearProgressBar = ({ isLoading }: LinearProgressBarProps) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [progressColor, setProgressColor] = useState("blue");
  
  useEffect(() => {
    if (!isLoading) {
      setElapsedTime(0);
      return;
    }
    
    const intervalId = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    
    // Cycle through colors for more visual appeal
    const colorInterval = setInterval(() => {
      setProgressColor(prev => {
        const colors = ["blue", "orange", "yellow", "green"];
        const currentIndex = colors.indexOf(prev);
        return colors[(currentIndex + 1) % colors.length];
      });
    }, 3000);
    
    return () => {
      clearInterval(intervalId);
      clearInterval(colorInterval);
    };
  }, [isLoading]);
  
  if (!isLoading) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="relative w-20 h-20 mb-6">
        {/* Outer spinning ring */}
        <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-spin-slow"></div>
        
        {/* Inner pulsing ring */}
        <div className="absolute inset-2 rounded-full border-2 border-white/50 animate-pulse-subtle"></div>
        
        {/* Dynamic color spinner */}
        <div className={cn(
          "absolute inset-1 rounded-full border-4 border-t-transparent border-l-transparent animate-spin",
          {
            "border-blue-400": progressColor === "blue",
            "border-orange-400": progressColor === "orange",
            "border-yellow-400": progressColor === "yellow",
            "border-green-400": progressColor === "green",
          }
        )}></div>
        
        {/* Center dot */}
        <div className="absolute inset-0 m-auto w-3 h-3 bg-white rounded-full"></div>
      </div>
      
      <div className="w-full max-w-xs">
        <p className="text-white/90 text-lg font-medium text-center mb-4">
          Analyzing your document and generating canvas...
        </p>
        
        <div className="progress progress--active mb-4">
          <div className={cn(
            "progress__bar",
            {
              "progress__bar--blue": progressColor === "blue",
              "progress__bar--orange": progressColor === "orange",
              "progress__bar--yellow": progressColor === "yellow",
              "progress__bar--green": progressColor === "green",
            }
          )} style={{ width: `${Math.min(100, elapsedTime * 2)}%` }}></div>
          <div className="progress__text">
            <em>{Math.min(100, elapsedTime * 2)}%</em> complete
          </div>
        </div>
        
        <div className="text-white/80 text-sm font-medium text-center">
          <div>Processing time: {formatTime(elapsedTime)}</div>
        </div>
      </div>
    </div>
  );
};

export default LinearProgressBar;
