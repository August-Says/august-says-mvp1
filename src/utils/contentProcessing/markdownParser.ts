
import { Section } from './types';

/**
 * Split a markdown string into sections based on headings
 */
export const splitIntoSections = (content: string): Section[] => {
  // Try to detect markdown headings
  const headingPattern = /(?:^|\n)(#+)\s+(.+)(?:\n|$)/g;
  let match;
  const sections: Section[] = [];
  let lastIndex = 0;
  
  while ((match = headingPattern.exec(content)) !== null) {
    const headingLevel = match[1].length;
    const title = match[2].trim();
    const startIndex = match.index + match[0].length;
    
    // If this isn't the first heading, capture the content from the previous heading
    if (lastIndex > 0) {
      const sectionContent = content.substring(lastIndex, match.index).trim();
      if (sectionContent) {
        sections.push({
          title: sections[sections.length - 1].title,
          content: sectionContent
        });
      }
    }
    
    sections.push({
      title,
      content: '' // Will be filled in the next iteration or at the end
    });
    
    lastIndex = startIndex;
  }
  
  // Handle the last section's content
  if (lastIndex > 0 && lastIndex < content.length) {
    const sectionContent = content.substring(lastIndex).trim();
    if (sectionContent) {
      sections[sections.length - 1].content = sectionContent;
    }
  }
  
  // If no headings were found, check for sections marked by other patterns
  if (sections.length === 0) {
    const sectionPattern = /(?:###\s*|##\s*|\*\*)(SUMMARY|OBJECTIVE|THE OUTCOME|STRATEGIC IMPLICATIONS|WHAT IS A CANVASS|RECOMMENDED CANVASS FORMAT)(?:\s*:|\*\*\s*:|\*\*)/gi;
    
    const matches = [...content.matchAll(new RegExp(sectionPattern, 'gi'))];
    
    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      const startPos = match.index!;
      const endPos = i < matches.length - 1 ? matches[i + 1].index! : content.length;
      
      const titleMatch = match[0];
      const titleContent = match[1];
      const cleanTitle = titleContent.trim();
      
      const sectionContent = content.substring(startPos + titleMatch.length, endPos).trim();
      
      if (sectionContent) {
        sections.push({
          title: cleanTitle,
          content: sectionContent
        });
      }
    }
  }
  
  // If still no sections, create a single section from the entire content
  if (sections.length === 0 && content.trim()) {
    sections.push({
      title: 'Summary',
      content: content.trim()
    });
  }
  
  return sections;
};
