
import { useState, useEffect } from 'react';

export const useProgressAnimation = (isLoading: boolean) => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  useEffect(() => {
    if (isLoading) {
      setLoadingProgress(0);
      
      const processingDelay = setTimeout(() => {
        setLoadingProgress(8);
        
        const interval = setInterval(() => {
          setLoadingProgress(prev => {
            if (prev < 15) {
              return prev + (Math.random() * 1.0 + 0.5);
            } else if (prev < 35) {
              return prev + (Math.random() * 2.0 + 1.0);
            } else if (prev < 60) {
              return prev + (Math.random() * 1.5 + 0.7);
            } else if (prev < 80) {
              return prev + (Math.random() * 0.8 + 0.3);
            } else {
              return prev + (Math.random() * 0.3 + 0.1);
            }
          });
        }, 300);
        
        return () => {
          clearInterval(interval);
          if (isLoading) {
            setLoadingProgress(100);
          }
        };
      }, 800);
      
      return () => {
        clearTimeout(processingDelay);
        setLoadingProgress(100);
      };
    }
  }, [isLoading]);
  
  return loadingProgress;
};
