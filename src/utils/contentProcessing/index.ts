
import type { Section } from './types';
import { splitIntoSections } from './markdownParser';
import { extractSectionsFromJSON } from './jsonParser';
import { formatSectionTitle } from './sectionFormatter';

/**
 * Process content from webhook responses, attempting to parse as JSON first
 * then falling back to markdown processing
 */
export const processContent = (content: string): Section[] => {
  let data;
  try {
    // Try to parse the content as JSON
    data = JSON.parse(content);
    
    // If we can parse as JSON, check for our expected schema format
    if (typeof data === 'object') {
      console.log("Successfully parsed JSON data, processing sections");
      const sections = extractSectionsFromJSON(data);
      
      if (sections.length > 0) {
        console.log(`Extracted ${sections.length} sections from JSON`);
        return sections;
      }
    }
  } catch (e) {
    // If JSON parsing fails, try to split content into sections
    console.error("Error parsing content as JSON:", e);
  }
  
  // If we get here, either JSON parsing failed or the structure wasn't as expected
  // Fallback to legacy method to split into sections
  console.log("Falling back to markdown parsing for content");
  return splitIntoSections(content);
};

export { splitIntoSections, extractSectionsFromJSON, formatSectionTitle };
export type { Section };
