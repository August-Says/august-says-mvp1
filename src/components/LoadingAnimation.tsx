
import { motion } from 'framer-motion';
import { RefreshCw, Zap } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { AnimatedCircularProgressBar } from '@/components/ui/animated-circular-progress-bar';

interface LoadingAnimationProps {
  message?: string;
  progress?: number;
}

const LoadingAnimation = ({ 
  message = "Generating your canvas...", 
  progress 
}: LoadingAnimationProps) => {
  const [pulsateAnimation, setPulsateAnimation] = useState<boolean>(true);
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
  
  // Update the display progress
  useEffect(() => {
    if (progress !== undefined) {
      setDisplayProgress(Math.min(Math.round(progress), 100));
      
      if (progress >= 100) {
        setPulsateAnimation(false);
      }
    }
  }, [progress]);
  
  // Determine primary color based on progress
  const getPrimaryColor = () => {
    if (displayProgress >= 100) {
      return "rgb(138, 43, 226)"; // BlueViolet
    } else if (displayProgress >= 85) {
      return "rgb(0, 191, 255)"; // DeepSkyBlue
    } else if (displayProgress >= 55) {
      return "rgb(153, 102, 204)"; // Medium purple
    } else if (displayProgress >= 30) {
      return "rgb(147, 112, 219)"; // Medium slate blue
    } else {
      return "rgb(30, 144, 255)"; // DodgerBlue
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative mb-6 flex items-center justify-center"
      >
        {/* Electric glow effect */}
        <motion.div 
          className="absolute inset-0 rounded-full"
          style={{ 
            boxShadow: `0 0 20px 5px ${getPrimaryColor()}`, 
            opacity: 0.4,
            filter: 'blur(10px)'
          }}
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.4, 0.6, 0.4]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Circular progress bar */}
        <AnimatedCircularProgressBar
          max={100}
          min={0}
          value={displayProgress}
          gaugePrimaryColor={getPrimaryColor()}
          gaugeSecondaryColor="rgba(255, 255, 255, 0.2)"
          size={160}
          strokeWidth={14}
          showValue={true}
          valueSize={42}
          valueFontWeight={700}
          valueColor="white"
        />
        
        {/* Lightning bolt sparks */}
        <motion.div 
          className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          animate={{ 
            y: [0, -5, 0],
            opacity: [0.7, 1, 0.7] 
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          <Zap className="w-8 h-8 text-yellow-300" />
        </motion.div>
        
        {/* Rotating flywheel in the center */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute"
          style={{ filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.7))' }}
        >
          <RefreshCw className="w-10 h-10 text-white" />
        </motion.div>
        
        {/* Percentage text highlight */}
        <motion.div
          className="absolute"
          animate={{ scale: [0.98, 1.02, 0.98] }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <motion.div 
            className="text-4xl font-bold text-white"
            style={{ 
              textShadow: `0 0 10px ${getPrimaryColor()}, 0 0 20px ${getPrimaryColor()}` 
            }}
          >
            {displayProgress}%
          </motion.div>
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
      
      {/* Electric pulse dots - only show when not complete */}
      {pulsateAnimation && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex space-x-4 items-center mt-4"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.8 }}
              animate={{ 
                scale: [0.8, 1.2, 0.8],
                boxShadow: [
                  `0 0 5px ${getPrimaryColor()}`,
                  `0 0 15px ${getPrimaryColor()}`,
                  `0 0 5px ${getPrimaryColor()}`
                ]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut",
              }}
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: getPrimaryColor() }}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default LoadingAnimation;
