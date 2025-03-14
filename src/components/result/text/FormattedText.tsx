
import React from 'react';

type TextPart = {
  type: 'text' | 'bold' | 'italic';
  content: string;
  key: string;
};

interface FormattedTextProps {
  parts: TextPart[];
  lineIndex: number;
}

export const BoldFormattedText: React.FC<FormattedTextProps> = ({ parts, lineIndex }) => (
  <p key={lineIndex} className="my-1 text-white/90">
    {parts.map(part => {
      if (part.type === 'bold') {
        return <strong key={part.key} className="font-bold">{part.content}</strong>;
      }
      return <span key={part.key}>{part.content}</span>;
    })}
  </p>
);

export const ItalicFormattedText: React.FC<FormattedTextProps> = ({ parts, lineIndex }) => (
  <p key={lineIndex} className="my-1 text-white/90">
    {parts.map(part => {
      if (part.type === 'italic') {
        return <em key={part.key} className="italic">{part.content}</em>;
      }
      return <span key={part.key}>{part.content}</span>;
    })}
  </p>
);

export const parseFormattedText = (
  line: string, 
  lineIndex: number, 
  pattern: RegExp, 
  type: 'bold' | 'italic'
): TextPart[] => {
  const parts: TextPart[] = [];
  let lastIndex = 0;
  let match;
  
  // Handle HTML-like tags for bold text (like <strong>text</strong>)
  if (type === 'bold' && pattern.toString().includes('strong')) {
    const strongRegex = /<strong>([^<]+)<\/strong>/g;
    while ((match = strongRegex.exec(line)) !== null) {
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
  } else {
    // Handle regular Markdown syntax (** or *)
    while ((match = pattern.exec(line)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: line.substring(lastIndex, match.index),
          key: `${lineIndex}-text-${lastIndex}`
        });
      }
      
      // Add the formatted text
      parts.push({
        type,
        content: match[1],
        key: `${lineIndex}-${type}-${match.index}`
      });
      
      lastIndex = match.index + match[0].length;
    }
  }
  
  // Add any remaining text
  if (lastIndex < line.length) {
    parts.push({
      type: 'text',
      content: line.substring(lastIndex),
      key: `${lineIndex}-text-${lastIndex}`
    });
  }
  
  return parts;
};
