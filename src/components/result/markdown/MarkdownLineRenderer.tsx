
import React from 'react';
import {
  MarkdownHeading,
  BulletPoint,
  NumberedItem,
  QuestionItem,
  PlainText,
  OptionsHeader,
  HorizontalRule,
  EmptySpace
} from '../text/MarkdownTextFormatters';
import { BoldFormattedText, ItalicFormattedText, parseFormattedText } from '../text/FormattedText';

interface MarkdownLineRendererProps {
  line: string;
  lineIndex: number;
}

export const MarkdownLineRenderer: React.FC<MarkdownLineRendererProps> = ({ line, lineIndex }) => {
  // Handle headings (## Heading)
  if (line.trim().startsWith('#')) {
    const level = line.trim().match(/^(#+)/)?.[0].length || 1;
    const text = line.trim().replace(/^#+\s+/, '');
    return <MarkdownHeading level={level} text={text} lineIndex={lineIndex} />;
  }
  
  // Handle bullet points
  if (line.trim().startsWith('-') || line.trim().startsWith('*')) {
    const content = line.trim().substring(1).trim();
    return <BulletPoint content={content} lineIndex={lineIndex} />;
  }
  
  // Handle numbered lists
  const numberedMatch = line.trim().match(/^(\d+)\.\s(.+)$/);
  if (numberedMatch) {
    return <NumberedItem number={numberedMatch[1]} content={numberedMatch[2]} lineIndex={lineIndex} />;
  }
  
  // Handle HTML-like <strong> tags
  if (line.includes('<strong>') && line.includes('</strong>')) {
    const parts = parseFormattedText(line, lineIndex, /<strong>([^<]+)<\/strong>/g, 'bold');
    return <BoldFormattedText parts={parts} lineIndex={lineIndex} />;
  }
  
  // Handle bold text with ** (fallback)
  if (line.includes('**') && line.match(/\*\*([^*]+)\*\*/)) {
    const parts = parseFormattedText(line, lineIndex, /\*\*([^*]+)\*\*/g, 'bold');
    return <BoldFormattedText parts={parts} lineIndex={lineIndex} />;
  }
  
  // Handle italic text with single asterisks
  if (line.includes('*') && line.match(/\*([^*]+)\*/)) {
    const parts = parseFormattedText(line, lineIndex, /\*([^*]+)\*/g, 'italic');
    return <ItalicFormattedText parts={parts} lineIndex={lineIndex} />;
  }
  
  // Handle horizontal rule
  if (line.trim() === '---') {
    return <HorizontalRule lineIndex={lineIndex} />;
  }
  
  // Handle questions (common in our webhook responses)
  if (line.trim().startsWith('Question') && line.includes(':')) {
    const parts = line.split(':');
    return <QuestionItem parts={parts} lineIndex={lineIndex} />;
  }
  
  // Handle options for questions
  if (line.trim() === 'Options:') {
    return <OptionsHeader lineIndex={lineIndex} />;
  }
  
  // Handle blank lines
  if (line.trim() === '') {
    return <EmptySpace lineIndex={lineIndex} />;
  }
  
  // Handle everything else
  return <PlainText content={line} lineIndex={lineIndex} />;
};
