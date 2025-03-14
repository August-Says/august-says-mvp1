
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
        // Handle headings (## Heading)
        if (line.trim().startsWith('#')) {
          const level = line.trim().match(/^(#+)/)?.[0].length || 1;
          const text = line.trim().replace(/^#+\s+/, '');
          
          if (level === 1) {
            return <h2 key={lineIndex} className="text-xl font-bold text-white mt-6 mb-4">{text}</h2>;
          } else if (level === 2) {
            return <h3 key={lineIndex} className="text-lg font-semibold text-white mt-5 mb-3">{text}</h3>;
          } else if (level === 3) {
            return <h4 key={lineIndex} className="text-base font-medium text-white mt-4 mb-2">{text}</h4>;
          } else {
            return <h5 key={lineIndex} className="text-sm font-medium text-white mt-3 mb-2">{text}</h5>;
          }
        }
        
        // Handle bullet points
        if (line.trim().startsWith('-') || line.trim().startsWith('*')) {
          return (
            <div key={lineIndex} className="flex items-start space-x-2 my-1 ml-4">
              <span className="text-cloudai-purple">•</span>
              <p className="text-white/90">{line.trim().substring(1).trim()}</p>
            </div>
          );
        }
        
        // Handle numbered lists
        const numberedMatch = line.trim().match(/^(\d+)\.\s(.+)$/);
        if (numberedMatch) {
          return (
            <div key={lineIndex} className="flex items-start space-x-2 my-1 ml-4">
              <span className="text-cloudai-purple min-w-[20px]">{numberedMatch[1]}.</span>
              <p className="text-white/90">{numberedMatch[2]}</p>
            </div>
          );
        }
        
        // Handle bold text
        if (line.includes('**') && line.match(/\*\*([^*]+)\*\*/)) {
          const parts = [];
          let lastIndex = 0;
          let match;
          const regex = /\*\*([^*]+)\*\*/g;
          
          while ((match = regex.exec(line)) !== null) {
            // Add text before the match
            if (match.index > lastIndex) {
              parts.push({
                type: 'text',
                content: line.substring(lastIndex, match.index),
                key: `${lineIndex}-text-${lastIndex}`
              });
            }
            
            // Add the bold text
            parts.push({
              type: 'bold',
              content: match[1],
              key: `${lineIndex}-bold-${match.index}`
            });
            
            lastIndex = match.index + match[0].length;
          }
          
          // Add any remaining text
          if (lastIndex < line.length) {
            parts.push({
              type: 'text',
              content: line.substring(lastIndex),
              key: `${lineIndex}-text-${lastIndex}`
            });
          }
          
          return (
            <p key={lineIndex} className="my-1 text-white/90">
              {parts.map(part => {
                if (part.type === 'bold') {
                  return <strong key={part.key} className="font-bold">{part.content}</strong>;
                }
                return <span key={part.key}>{part.content}</span>;
              })}
            </p>
          );
        }
        
        // Handle italic text with single asterisks
        if (line.includes('*') && line.match(/\*([^*]+)\*/)) {
          const parts = [];
          let lastIndex = 0;
          let match;
          const regex = /\*([^*]+)\*/g;
          
          while ((match = regex.exec(line)) !== null) {
            // Add text before the match
            if (match.index > lastIndex) {
              parts.push({
                type: 'text',
                content: line.substring(lastIndex, match.index),
                key: `${lineIndex}-text-${lastIndex}`
              });
            }
            
            // Add the italic text
            parts.push({
              type: 'italic',
              content: match[1],
              key: `${lineIndex}-italic-${match.index}`
            });
            
            lastIndex = match.index + match[0].length;
          }
          
          // Add any remaining text
          if (lastIndex < line.length) {
            parts.push({
              type: 'text',
              content: line.substring(lastIndex),
              key: `${lineIndex}-text-${lastIndex}`
            });
          }
          
          return (
            <p key={lineIndex} className="my-1 text-white/90">
              {parts.map(part => {
                if (part.type === 'italic') {
                  return <em key={part.key} className="italic">{part.content}</em>;
                }
                return <span key={part.key}>{part.content}</span>;
              })}
            </p>
          );
        }
        
        // Handle horizontal rule
        if (line.trim() === '---') {
          return <hr key={lineIndex} className="my-4 border-white/20" />;
        }
        
        // Handle questions (common in our webhook responses)
        if (line.trim().startsWith('Question') && line.includes(':')) {
          const parts = line.split(':');
          return (
            <div key={lineIndex} className="mt-4 mb-2">
              <strong className="text-cloudai-purple">{parts[0]}:</strong>
              <span className="text-white/90">{parts.slice(1).join(':')}</span>
            </div>
          );
        }
        
        // Handle options for questions
        if (line.trim() === 'Options:') {
          return <div key={lineIndex} className="text-sm font-medium mt-2 mb-1 text-white/70">Options:</div>;
        }
        
        // Handle blank lines
        if (line.trim() === '') {
          return <div key={lineIndex} className="h-4"></div>;
        }
        
        // Handle everything else
        return <p key={lineIndex} className="my-1 text-white/90">{line}</p>;
      })}
    </div>
  );
};

const ContentDisplay = ({ sections, formatSectionTitle, contentRef }: ContentDisplayProps) => {
  return (
    <div ref={contentRef} className="space-y-8 text-white pdf-content">
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
