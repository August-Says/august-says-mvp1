
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { FileText, Clipboard } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState("default");
  
  // Track if the cursor is over a clickable element to change style
  const [isHovering, setIsHovering] = useState(false);
  
  // Use refs to store cursor elements
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorOutlineRef = useRef<HTMLDivElement>(null);
  
  // Handle mouse movement
  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };
    
    window.addEventListener("mousemove", mouseMove);
    
    // Add hover detection for clickable elements
    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);
    
    // Add event listeners to all buttons and links
    const clickableElements = document.querySelectorAll('button, a, [role="button"]');
    clickableElements.forEach(element => {
      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);
    });
    
    return () => {
      window.removeEventListener("mousemove", mouseMove);
      clickableElements.forEach(element => {
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);
  
  // Cursor animation variants
  const variants = {
    default: {
      x: mousePosition.x - 8,
      y: mousePosition.y - 8,
      transition: {
        type: "spring",
        mass: 0.1,
        stiffness: 800,
        damping: 25
      }
    },
    hover: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      width: 32,
      height: 32,
      backgroundColor: "rgba(155, 135, 245, 0.4)",
      mixBlendMode: "difference" as const, // Use const assertion to fix type
      transition: {
        type: "spring",
        mass: 0.1,
        stiffness: 800,
        damping: 25
      }
    }
  };
  
  // Cursor outline animation variants
  const outlineVariants = {
    default: {
      x: mousePosition.x - 24,
      y: mousePosition.y - 24,
      transition: {
        type: "spring",
        mass: 0.7,
        stiffness: 200,
        damping: 20,
        restDelta: 0.001
      }
    },
    hover: {
      x: mousePosition.x - 32,
      y: mousePosition.y - 32,
      width: 64,
      height: 64,
      opacity: 0.5,
      transition: {
        type: "spring",
        mass: 0.7,
        stiffness: 200,
        damping: 20
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 p-4 md:p-8 animate-fade-in relative z-10 cursor-none">
      {/* Custom cursor */}
      <motion.div
        ref={cursorRef}
        className="custom-cursor"
        variants={variants}
        animate={isHovering ? "hover" : "default"}
        style={{
          position: "fixed",
          zIndex: 9999,
          pointerEvents: "none",
          width: 16,
          height: 16,
          borderRadius: "50%",
          backgroundColor: "rgba(155, 135, 245, 0.8)",
          mixBlendMode: "difference" as const // Use const assertion to fix type
        }}
      />
      
      {/* Cursor outline */}
      <motion.div
        ref={cursorOutlineRef}
        className="cursor-outline"
        variants={outlineVariants}
        animate={isHovering ? "hover" : "default"}
        style={{
          position: "fixed",
          zIndex: 9998,
          pointerEvents: "none",
          width: 48,
          height: 48,
          borderRadius: "50%",
          border: "2px solid rgba(155, 135, 245, 0.4)",
          opacity: 0.6,
          mixBlendMode: "difference" as const // Use const assertion to fix type
        }}
      />

      <div className="max-w-3xl w-full text-center mb-12 pt-8 md:pt-12">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight"
        >
          Start Generating Your Canvas
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-white/80 mb-10 max-w-2xl mx-auto"
        >
          Create professional marketing strategies for your clients using our intuitive AI-powered canvas generator.
        </motion.p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col h-full"
          >
            <div className="glass-morphism p-8 rounded-2xl flex flex-col h-full">
              <div className="mb-6 mx-auto p-4 rounded-full bg-white/10">
                <Clipboard size={40} className="text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-3">Use Fields</h2>
              <p className="text-white/70 mb-6 flex-grow">
                Input specific information about your client and project using our structured form fields.
              </p>
              <Button 
                onClick={() => navigate('/fields')} 
                className="bg-white text-[#301E63] hover:bg-white/90 font-medium"
              >
                Start with Fields
              </Button>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col h-full"
          >
            <div className="glass-morphism p-8 rounded-2xl flex flex-col h-full">
              <div className="mb-6 mx-auto p-4 rounded-full bg-white/10">
                <FileText size={40} className="text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-3">Use PDF</h2>
              <p className="text-white/70 mb-6 flex-grow">
                Upload an existing document or paste text to quickly generate a marketing canvas.
              </p>
              <Button 
                onClick={() => navigate('/pdf')} 
                className="bg-white text-[#301E63] hover:bg-white/90 font-medium"
              >
                Start with PDF
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;
