
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface LinearProgressBarProps {
  isLoading: boolean;
}

const LinearProgressBar = ({ isLoading }: LinearProgressBarProps) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [progressColor, setProgressColor] = useState("blue");
  const [rotation, setRotation] = useState(0);
  
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
    
    // Add smooth rotation animation
    const rotationInterval = setInterval(() => {
      setRotation(prev => (prev + 5) % 360);
    }, 50);
    
    return () => {
      clearInterval(intervalId);
      clearInterval(colorInterval);
      clearInterval(rotationInterval);
    };
  }, [isLoading]);
  
  if (!isLoading) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercent = Math.min(100, elapsedTime * 2);

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="relative w-24 h-24 mb-6">
        {/* Outer spinning ring with gradient */}
        <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-spin-slow"></div>
        
        {/* Middle ring with slow reverse spin */}
        <div className="absolute inset-2 rounded-full border-3 border-white/40" 
             style={{ 
               transform: `rotate(${-rotation * 0.7}deg)`,
               borderWidth: '3px',
               borderTopColor: 'rgba(255, 255, 255, 0.8)',
               borderRightColor: 'rgba(255, 255, 255, 0.4)',
               borderBottomColor: 'rgba(255, 255, 255, 0.2)',
               borderLeftColor: 'rgba(255, 255, 255, 0.6)'
             }}>
        </div>
        
        {/* Inner pulsing ring */}
        <div className="absolute inset-4 rounded-full border-2 border-white/50 animate-pulse-subtle"></div>
        
        {/* Dynamic color spinner */}
        <div className={cn(
          "absolute inset-6 rounded-full border-4 border-t-transparent border-l-transparent animate-spin",
          {
            "border-blue-400": progressColor === "blue",
            "border-orange-400": progressColor === "orange",
            "border-yellow-400": progressColor === "yellow",
            "border-green-400": progressColor === "green",
          }
        )}></div>
        
        {/* Percentage text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white text-sm font-medium">{progressPercent}%</span>
        </div>
        
        {/* Orbiting dot */}
        <div className="absolute w-3 h-3 bg-white rounded-full" 
             style={{ 
               left: `${12 + 10 * Math.cos(rotation * Math.PI / 180)}px`, 
               top: `${12 + 10 * Math.sin(rotation * Math.PI / 180)}px` 
             }}>
        </div>
      </div>
      
      <div className="w-full max-w-xs">
        <p className="text-white/90 text-lg font-medium text-center mb-4">
          Analyzing your document and generating canvas...
        </p>
        
        <div className="text-white/80 text-sm font-medium text-center">
          <div>Processing time: {formatTime(elapsedTime)}</div>
        </div>
      </div>
    </div>
  );
};

export default LinearProgressBar;
