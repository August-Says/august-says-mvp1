
import { useState, useEffect } from 'react';

export const useProgressAnimation = (isLoading: boolean) => {
  const [progress, setProgress] = useState(0);
  
  // Create a simulated progress effect when loading
  useEffect(() => {
    if (!isLoading) {
      setProgress(0);
      return;
    }
    
    // Reset progress when loading starts
    setProgress(0);
    
    // Simulate progress with decreasing speed as it approaches 100%
    const simulateProgress = () => {
      setProgress(currentProgress => {
        // Slow down as we approach higher percentages
        if (currentProgress >= 90) {
          return currentProgress + 0.2;
        } else if (currentProgress >= 80) {
          return currentProgress + 0.5;
        } else if (currentProgress >= 60) {
          return currentProgress + 1;
        } else {
          return currentProgress + 2;
        }
      });
    };
    
    const interval = setInterval(() => {
      setProgress(current => {
        if (current >= 99) {
          clearInterval(interval);
          return 99; // Never reach 100% until loading is complete
        }
        return current;
      });
    }, 1000);
    
    // Create multiple intervals with different speeds for a more natural feeling
    const fastInterval = setInterval(simulateProgress, 300);
    
    return () => {
      clearInterval(interval);
      clearInterval(fastInterval);
      // When loading completes, jump to 100%
      if (!isLoading) {
        setProgress(100);
      }
    };
  }, [isLoading]);
  
  return progress;
};
