
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
      console.log("Successfully parsed JSON data from webhook");
      
      // If it's an array of outputs, log how many we have
      if (Array.isArray(data)) {
        console.log(`Found ${data.length} output objects in webhook response`);
        
        // Specifically log details about the first 4 outputs if they exist
        for (let i = 0; i < Math.min(4, data.length); i++) {
          const output = data[i]?.output;
          if (output) {
            if (typeof output === 'string') {
              console.log(`Output ${i+1} is a string (possibly markdown)`);
            } else {
              console.log(`Output ${i+1} is an object with keys:`, Object.keys(output));
            }
          } else {
            console.log(`Output ${i+1} is missing or does not have an output property`);
          }
        }
      }
      
      // Extract sections using our JSON parser
      const sections = extractSectionsFromJSON(data);
      
      if (sections.length > 0) {
        console.log(`Extracted ${sections.length} sections from JSON`);
        return sections;
      } else {
        console.log("No sections extracted from JSON, falling back to markdown parsing");
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
