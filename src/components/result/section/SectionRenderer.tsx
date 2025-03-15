
import React from 'react';
import { motion } from 'framer-motion';
import { MarkdownContentRenderer } from '../markdown/MarkdownContentRenderer';
import { GameImageDisplay } from '../GameImageDisplay';
import { GameImage } from '@/utils/contentProcessing/types';

interface SectionProps {
  title: string;
  content: string;
  index: number;
  gameImages?: GameImage[];
}

export const SectionRenderer: React.FC<SectionProps> = ({ title, content, index, gameImages }) => {
  const isQuestionsSection = title.toLowerCase() === 'questions';
  
  return (
    <motion.div 
      key={index}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 * index }}
      className="border-b border-white/10 pb-6 last:border-0"
    >
      <h3 className="text-xl font-bold text-white mb-3 tracking-wide">{title}</h3>
      <div className="text-white/80 prose prose-sm prose-invert max-w-none">
        <MarkdownContentRenderer content={content} />
      </div>
      
      {isQuestionsSection && gameImages && gameImages.length > 0 && (
        <GameImageDisplay 
          images={gameImages} 
          useLocalImages={true}
        />
      )}
    </motion.div>
  );
};
