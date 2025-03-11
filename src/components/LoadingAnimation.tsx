
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

interface LoadingAnimationProps {
  message?: string;
  progress?: number;
}

const LoadingAnimation = ({ 
  message = "Generating your canvas...", 
  progress 
}: LoadingAnimationProps) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-24 h-24 flex items-center justify-center"
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
        
        {/* Progress indicator (optional) */}
        {progress !== undefined && (
          <div className="absolute inset-0">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <motion.circle
                initial={{ pathLength: 0 }}
                animate={{ pathLength: progress / 100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="rgba(255, 255, 255, 0.8)"
                strokeWidth="4"
                strokeDasharray="251.2"
                strokeDashoffset="0"
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
            </svg>
          </div>
        )}
      </motion.div>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-white/90 text-lg font-medium text-center"
      >
        {message}
      </motion.p>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex space-x-3 items-center"
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
    </div>
  );
};

export default LoadingAnimation;
