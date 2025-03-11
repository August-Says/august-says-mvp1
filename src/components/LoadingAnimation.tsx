
import { motion } from 'framer-motion';

interface LoadingAnimationProps {
  message?: string;
}

const LoadingAnimation = ({ message = "Generating your canvas..." }: LoadingAnimationProps) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-12">
      <div className="relative w-20 h-20">
        <motion.div
          initial={{ opacity: 0.3, scale: 0.8 }}
          animate={{ 
            opacity: [0.3, 1, 0.3],
            scale: [0.8, 1, 0.8],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 rounded-full bg-august-purple/30 backdrop-blur-sm"
        />
        
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </div>
      
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
