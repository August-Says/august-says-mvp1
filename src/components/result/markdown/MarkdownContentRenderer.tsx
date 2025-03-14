
import React from 'react';
import { MarkdownLineRenderer } from './MarkdownLineRenderer';

interface MarkdownContentRendererProps {
  content: string;
}

export const MarkdownContentRenderer: React.FC<MarkdownContentRendererProps> = ({ content }) => {
  if (!content) {
    return <p className="text-white/50 italic">No content available</p>;
  }
  
  const lines = content.split('\n');
  
  return (
    <div>
      {lines.map((line, lineIndex) => (
        <MarkdownLineRenderer key={lineIndex} line={line} lineIndex={lineIndex} />
      ))}
    </div>
  );
};
