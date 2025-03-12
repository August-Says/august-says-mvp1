
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface LoadingAnimationProps {
  message?: string;
  progress?: number;
}

const LoadingAnimation = ({ 
  message = "Generating your canvas...", 
  progress 
}: LoadingAnimationProps) => {
  const [pulsateAnimation, setPulsateAnimation] = useState<boolean>(true);
  const [progressClass, setProgressClass] = useState<string>("");
  const [displayProgress, setDisplayProgress] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  
  // Format the elapsed time as mm:ss
  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Determine the color class based on progress
  useEffect(() => {
    if (progress !== undefined) {
      setDisplayProgress(Math.min(Math.round(progress), 100));
      
      if (progress >= 100) {
        setPulsateAnimation(false);
        setProgressClass("progress__bar--blue");
      } else if (progress >= 85) {
        setProgressClass("progress__bar--green");
      } else if (progress >= 55) {
        setProgressClass("progress__bar--yellow");
      } else if (progress >= 30) {
        setProgressClass("progress__bar--orange");
      } else {
        setProgressClass("");
      }
    }
  }, [progress]);
  
  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-24 h-24 flex items-center justify-center mb-6"
      >
        {/* Animated background circle */}
        <div className="absolute inset-0 rounded-full bg-cloudai-purple/20 backdrop-blur-sm" />
        
        {/* Rotating flywheel */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <RefreshCw className="w-12 h-12 text-white" />
        </motion.div>
      </motion.div>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-white/90 text-lg font-medium text-center"
      >
        {message}
      </motion.p>
      
      {/* Timer display */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-white/80 text-sm font-medium"
      >
        Time elapsed: {formatTime(elapsedTime)}
      </motion.div>
      
      {/* Battle.net style progress bar */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-md mx-auto"
      >
        <div className="progress progress--active">
          <b 
            className={`progress__bar ${progressClass}`} 
            style={{ 
              width: `${displayProgress}%`,
              opacity: 1
            }}
          >
            <span className="progress__text text-white">
              Progress: <em>{displayProgress}%</em>
            </span>
          </b>
        </div>
      </motion.div>
      
      {/* Pulsating dots - only show when not complete */}
      {pulsateAnimation && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex space-x-3 items-center mt-4"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.8 }}
              animate={{ scale: [0.8, 1.2, 0.8] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut",
              }}
              className="w-2.5 h-2.5 rounded-full bg-white/80"
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default LoadingAnimation;
