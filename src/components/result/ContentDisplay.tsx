
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
  if (!content) return <p className="text-white/50 italic">No content available</p>;
  
  const lines = content.split('\n');
  
  return (
    <div>
      {lines.map((line, lineIndex) => {
        // Handle bullet points
        if (line.trim().startsWith('-') || line.trim().startsWith('*')) {
          return (
            <div key={lineIndex} className="flex items-start space-x-2 my-1">
              <span className="text-cloudai-purple">•</span>
              <p>{line.trim().substring(1).trim()}</p>
            </div>
          );
        }
        
        // Handle numbered lists
        const numberedMatch = line.trim().match(/^(\d+)\.\s(.+)$/);
        if (numberedMatch) {
          return (
            <div key={lineIndex} className="flex items-start space-x-2 my-1">
              <span className="text-cloudai-purple min-w-[20px]">{numberedMatch[1]}.</span>
              <p>{numberedMatch[2]}</p>
            </div>
          );
        }
        
        // Handle questions (common in our webhook responses)
        if (line.trim().startsWith('Question') && line.includes(':')) {
          const parts = line.split(':');
          return (
            <div key={lineIndex} className="mt-4 mb-2">
              <strong className="text-cloudai-purple">{parts[0]}:</strong>
              <span>{parts.slice(1).join(':')}</span>
            </div>
          );
        }
        
        // Handle options for questions
        if (line.trim() === 'Options:') {
          return <div key={lineIndex} className="text-sm font-medium mt-2 mb-1">Options:</div>;
        }
        
        // Handle blank lines
        if (line.trim() === '') {
          return <div key={lineIndex} className="h-4"></div>;
        }
        
        // Handle everything else
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
          <p className="text-white/80">No content could be parsed from the response. Please check the raw response for details.</p>
        </div>
      )}
    </div>
  );
};

export default ContentDisplay;
