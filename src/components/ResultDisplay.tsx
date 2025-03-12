
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import PdfExportButton from '@/components/result/PdfExportButton';
import ShareButton from '@/components/result/ShareButton';
import ContentDisplay from '@/components/result/ContentDisplay';
import { processContent, formatSectionTitle } from '@/components/result/ContentParser';

interface ResultDisplayProps {
  result: string;
  onBack: () => void;
}

const ResultDisplay = ({ result, onBack }: ResultDisplayProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const processedSections = processContent(result);
  
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
          <PdfExportButton contentRef={contentRef} />
          <ShareButton />
        </div>
      </div>
      
      <ContentDisplay 
        sections={processedSections} 
        formatSectionTitle={formatSectionTitle}
        contentRef={contentRef}
      />
      
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

export default ResultDisplay;
