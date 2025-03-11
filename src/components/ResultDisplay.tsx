import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Download, Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface ResultDisplayProps {
  result: string;
  onBack: () => void;
}

const ResultDisplay = ({ result, onBack }: ResultDisplayProps) => {
  const handleExportPDF = () => {
    toast.success('PDF export functionality will be available soon!');
  };

  const handleShare = () => {
    toast.success('Share functionality will be available soon!');
  };

  const parseResult = (result: string) => {
    try {
      const parsed = JSON.parse(result);
      if (typeof parsed === 'object') {
        return JSON.stringify(parsed, null, 2);
      }
      return result;
    } catch (e) {
      return result;
    }
  };

  const processContent = (content: string) => {
    if (content.includes('##') || content.includes('#')) {
      return content.split('##').filter(section => section.trim());
    }
    return [content];
  };

  const processedResult = parseResult(result);
  const sections = processContent(processedResult);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-4xl mx-auto glass-morphism rounded-2xl p-8 md:p-10 my-8 shadow-lg overflow-y-auto"
    >
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-0">Your Marketing Canvas</h2>
        <div className="flex space-x-4">
          <Button 
            onClick={handleExportPDF} 
            className="bg-white text-august-purple hover:bg-white/90"
          >
            <Download size={18} className="mr-2" />
            Export PDF
          </Button>
          <Button 
            onClick={handleShare} 
            variant="outline" 
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Share2 size={18} className="mr-2" />
            Share
          </Button>
        </div>
      </div>
      
      <div className="space-y-8 text-white/90">
        {sections.length > 0 ? (
          sections.map((section, index) => {
            let title = '';
            let content = '';
            
            const lines = section.trim().split('\n');
            
            if (lines[0].startsWith('# ')) {
              title = lines[0].substring(2).trim();
              content = lines.slice(1).join('\n').trim();
            } else if (lines[0].trim() && !lines[0].includes(':')) {
              title = lines[0].trim();
              content = lines.slice(1).join('\n').trim();
            } else {
              title = index === 0 ? 'Summary' : `Section ${index + 1}`;
              content = section.trim();
            }
            
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="border-b border-white/10 pb-6 last:border-0"
              >
                <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
                <div className="text-white/80 prose prose-sm prose-invert max-w-none">
                  {renderMarkdownContent(content)}
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-10">
            <p className="text-white/80">Your marketing canvas will appear here.</p>
          </div>
        )}
      </div>
      
      <div className="mt-8 pt-4 border-t border-white/10 flex justify-center">
        <Button
          onClick={onBack}
          variant="outline"
          className="bg-cloudai-purple text-white hover:bg-cloudai-violetpurple border-transparent font-medium shadow-md"
        >
          Generate New Canvas
        </Button>
      </div>
    </motion.div>
  );
};

const renderMarkdownContent = (content: string) => {
  const lines = content.split('\n');
  
  return (
    <div>
      {lines.map((line, lineIndex) => {
        if (line.trim().startsWith('-') || line.trim().startsWith('*')) {
          return (
            <div key={lineIndex} className="flex items-start space-x-2 my-1">
              <span className="text-cloudai-purple">•</span>
              <p>{line.trim().substring(1).trim()}</p>
            </div>
          );
        }
        
        const numberedMatch = line.trim().match(/^(\d+)\.\s(.+)$/);
        if (numberedMatch) {
          return (
            <div key={lineIndex} className="flex items-start space-x-2 my-1">
              <span className="text-cloudai-purple min-w-[20px]">{numberedMatch[1]}.</span>
              <p>{numberedMatch[2]}</p>
            </div>
          );
        }
        
        if (line.trim() === '') {
          return <div key={lineIndex} className="h-4"></div>;
        }
        
        return <p key={lineIndex} className="my-1">{line}</p>;
      })}
    </div>
  );
};

export default ResultDisplay;
