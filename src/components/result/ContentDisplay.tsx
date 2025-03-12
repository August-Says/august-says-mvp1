
import React from 'react';
import { motion } from 'framer-motion';

interface Section {
  title: string;
  content: string;
}

interface ContentDisplayProps {
  sections: Section[];
  formatSectionTitle: (title: string) => string;
  contentRef: React.RefObject<HTMLDivElement>;
}

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

const ContentDisplay = ({ sections, formatSectionTitle, contentRef }: ContentDisplayProps) => {
  return (
    <div ref={contentRef} className="space-y-8 text-white/90 pdf-content">
      {sections.length > 0 ? (
        sections.map((section, index) => {
          const title = formatSectionTitle(section.title);
          const content = section.content.trim();
          
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
  );
};

export default ContentDisplay;
