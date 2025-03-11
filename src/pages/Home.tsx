
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { FileText, Clipboard } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center flex-1 p-4 md:p-8 animate-fade-in">
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
                className="bg-white text-august-purple hover:bg-white/90 font-medium"
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
                className="bg-white text-august-purple hover:bg-white/90 font-medium"
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
