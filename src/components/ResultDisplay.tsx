import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import PdfExportButton from '@/components/result/PdfExportButton';
import ShareButton from '@/components/result/ShareButton';
import ContentDisplay from '@/components/result/ContentDisplay';
import { processContent, formatSectionTitle } from '@/components/result/ContentParser';
import { GameImage } from '@/utils/contentProcessing/types';

interface ResultDisplayProps {
  result: string;
  onBack: () => void;
}

const ResultDisplay = ({ result, onBack }: ResultDisplayProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const processedSections = processContent(result);
  const [showRawJson, setShowRawJson] = useState(false);
  
  // Game image examples that will be displayed in the Questions section
  const gameImages: GameImage[] = [
    {
      path: 'lovable-uploads/9e8ce792-da11-4a52-8b78-6535033bb057.png',
      caption: 'Sample game visualization showing question options'
    },
    {
      path: 'lovable-uploads/9e8ce792-da11-4a52-8b78-6535033bb057.png',
      caption: 'Sample visualization of a survey question format'
    }
  ];
  
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
          <ShareButton contentRef={contentRef} />
        </div>
      </div>
      
      <div className="text-center mb-8">
        <img 
          src="/lovable-uploads/88f0766a-a7d4-4c0a-a3f7-64fe15baa48e.png" 
          alt="Agency of Impact Logo" 
          className="mx-auto h-16 md:h-20"
        />
      </div>
      
      <ContentDisplay 
        sections={processedSections} 
        formatSectionTitle={formatSectionTitle}
        contentRef={contentRef}
        gameImages={gameImages}
      />
      
      <div className="mt-8 pt-4 border-t border-white/10 flex justify-between items-center">
        <Button
          onClick={onBack}
          variant="outline"
          className="bg-cloudai-purple text-white hover:bg-cloudai-violetpurple border-transparent font-medium shadow-md"
        >
          Generate New Canvas
        </Button>
        
        <Button
          onClick={() => setShowRawJson(!showRawJson)}
          variant="ghost"
          className="text-white/70 hover:text-white hover:bg-white/10"
        >
          {showRawJson ? "Hide Raw JSON" : "Show Raw JSON"}
        </Button>
      </div>
      
      {showRawJson && (
        <div className="mt-6 p-4 bg-black/20 rounded-md">
          <h3 className="text-lg font-medium text-white mb-2">Raw Response Data:</h3>
          <pre className="text-xs text-white/70 overflow-auto max-h-[400px] p-2">
            {result}
          </pre>
        </div>
      )}
    </motion.div>
  );
};

export default ResultDisplay;
