
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
        
        // Specifically log details about each output if they exist
        for (let i = 0; i < data.length; i++) {
          const output = data[i]?.output;
          if (output) {
            if (typeof output === 'string') {
              console.log(`Output ${i+1} is a string (possibly markdown) - first 50 chars:`, output.substring(0, 50));
            } else if (typeof output === 'object') {
              console.log(`Output ${i+1} is an object with keys:`, Object.keys(output));
              
              // Log more details about specific structures we're looking for
              if (output.summary) console.log(`Output ${i+1} has a summary field`);
              if (output.objective) console.log(`Output ${i+1} has an objective field`);
              if (output.outcome) console.log(`Output ${i+1} has an outcome field with possible insights and implications`);
              if (output.canvass) console.log(`Output ${i+1} has a canvass field with possible definition, format, and questions`);
              if (output.activation_add_ons) console.log(`Output ${i+1} has activation_add_ons field`);
            }
          } else {
            console.log(`Output ${i+1} is missing or does not have an output property`);
          }
        }
      } else {
        console.log("Data is a single object, not an array");
        // Log keys for object format
        console.log("Object keys:", Object.keys(data));
        
        // Look for specific outputs
        if (data.output) {
          console.log("Found output property in single object");
          if (typeof data.output === 'object') {
            console.log("Output is an object with keys:", Object.keys(data.output));
          }
        }
      }
      
      // Extract sections using our JSON parser
      const sections = extractSectionsFromJSON(data);
      
      if (sections.length > 0) {
        console.log(`Extracted ${sections.length} sections from JSON: `, sections.map(s => s.title).join(', '));
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
  const markdownSections = splitIntoSections(content);
  console.log(`Extracted ${markdownSections.length} sections from markdown parsing`);
  return markdownSections;
};

export { splitIntoSections, extractSectionsFromJSON, formatSectionTitle };
export type { Section };
