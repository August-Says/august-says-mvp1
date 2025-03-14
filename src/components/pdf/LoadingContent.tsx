
import { Loader2, Check } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';

interface LoadingContentProps {
  loadingProgress?: number;
}

const LoadingContent = ({ loadingProgress = 0 }: LoadingContentProps) => {
  const [seconds, setSeconds] = useState(0);
  
  // Timer for seconds counter
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Format seconds into mm:ss
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="w-full max-w-4xl mx-auto glass-morphism rounded-xl p-8 shadow-lg shadow-blue-500/20">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-0">Your Marketing Canvas</h2>
        </div>
        
        <div className="py-4 flex flex-col items-center justify-center">
          <div className="relative my-12">
            {/* Elegant loading spinner */}
            <motion.div 
              className="w-48 h-48 rounded-full flex items-center justify-center"
              style={{
                boxShadow: "0 0 25px rgba(123, 92, 240, 0.6)",
                background: "linear-gradient(135deg, rgba(99, 48, 180, 0.2) 0%, rgba(48, 85, 181, 0.2) 100%)",
                backdropFilter: "blur(10px)"
              }}
            >
              {/* Outer spinning ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-transparent"
                style={{
                  borderLeftColor: "#7B5CF0",
                  borderRightColor: "#3C86F0",
                  borderTopWidth: "4px",
                  borderBottomWidth: "4px",
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Middle ring with glow */}
              <motion.div
                className="absolute w-40 h-40 rounded-full border-2 border-transparent"
                style={{
                  borderTopColor: "rgba(255, 255, 255, 0.8)",
                  borderRightColor: "rgba(123, 92, 240, 0.6)",
                  boxShadow: "0 0 15px rgba(60, 134, 240, 0.4)"
                }}
                animate={{ rotate: -180 }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
              
              {/* Inner circle with pulsing effect */}
              <motion.div
                className="w-32 h-32 rounded-full bg-white/5 flex items-center justify-center"
                animate={{ scale: [0.95, 1.05, 0.95] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <motion.div
                  className="text-white text-5xl"
                  style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.7))" }}
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Loader2 className="w-12 h-12 text-august-purple animate-spin" />
                </motion.div>
              </motion.div>
              
              {/* Orbiting elements */}
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 rounded-full bg-white"
                  style={{ 
                    boxShadow: "0 0 10px rgba(255,255,255,0.8)",
                  }}
                  animate={{
                    x: Math.cos(i * Math.PI / 2) * 70,
                    y: Math.sin(i * Math.PI / 2) * 70,
                    scale: [1, 1.5, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{
                    duration: 3,
                    delay: i * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.div>
          </div>
          
          {/* Time counter and progress bar */}
          <div className="w-full max-w-sm mx-auto mb-6">
            <div className="flex justify-between items-center mb-1">
              <span className="text-white/90 text-sm font-medium">Progress</span>
              <span className="text-white/90 text-sm font-medium">{Math.round(loadingProgress)}%</span>
            </div>
            <Progress value={loadingProgress} className="h-2 bg-white/10" />
            <div className="mt-2 text-center">
              <span className="text-white/70 text-sm">Time elapsed: {formatTime(seconds)}</span>
            </div>
          </div>
          
          <motion.div 
            className="text-white/90 text-xl font-medium mt-4 text-center"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            Creating your marketing canvas...
          </motion.div>
          
          <motion.div className="mt-8 flex space-x-2 items-center">
            {["Analyzing", "Processing", "Optimizing", "Finalizing"].map((text, index) => (
              <motion.div 
                key={index}
                className="flex items-center bg-white/10 px-4 py-2 rounded-full"
                initial={{ opacity: 0.3, x: -5 }}
                animate={{ 
                  opacity: [0.3, 1, 0.3], 
                  x: 0,
                  boxShadow: [
                    "0 0 0 rgba(123, 92, 240, 0)",
                    "0 0 10px rgba(123, 92, 240, 0.8)",
                    "0 0 0 rgba(123, 92, 240, 0)"
                  ]
                }}
                transition={{ 
                  duration: 3,
                  delay: index * 0.75, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <span className="text-white text-sm mr-2">{text}</span>
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: index % 2 === 0 ? [0, 180, 360] : [360, 180, 0]
                  }}
                  transition={{
                    duration: 2,
                    delay: index * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {index === 3 ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Loader2 className="w-4 h-4 text-august-blue animate-spin" />
                  )}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoadingContent;
