
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
        setProgressClass("bg-gradient-to-r from-cloudai-purple via-cloudai-violetpurple to-cloudai-blue");
      } else if (progress >= 85) {
        setProgressClass("bg-gradient-to-r from-cloudai-blue to-cloudai-lightblue");
      } else if (progress >= 55) {
        setProgressClass("bg-gradient-to-r from-august-lightpurple to-august-purple");
      } else if (progress >= 30) {
        setProgressClass("bg-gradient-to-r from-august-purple to-august-accent");
      } else {
        setProgressClass("bg-gradient-to-r from-august-accent to-august-blue");
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
      
      {/* Modern animated progress bar */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-md mx-auto"
      >
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className={`h-full ${progressClass}`}
            initial={{ width: "0%" }}
            animate={{ 
              width: `${displayProgress}%`,
              transition: { duration: 0.5, ease: "easeOut" }
            }}
            style={{
              boxShadow: "0 0 10px rgba(255, 255, 255, 0.5)"
            }}
          >
            <motion.div
              className="h-full w-20 absolute"
              animate={{
                x: ["0%", "100%"],
                opacity: [0, 1, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "linear",
              }}
              style={{
                background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%)"
              }}
            />
          </motion.div>
        </div>
        <div className="mt-2 text-white/80 text-xs font-medium text-center">
          Progress: {displayProgress}%
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
