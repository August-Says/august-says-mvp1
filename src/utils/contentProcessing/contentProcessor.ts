
import { Section } from './types';
import { splitIntoSections } from './markdownParser';
import { extractSectionsFromJSON } from './jsonParser';
import { logger } from './logger';

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
      logger.info("Successfully parsed JSON data from webhook");
      
      // If it's an array of outputs, log how many we have
      if (Array.isArray(data)) {
        logger.info(`Found ${data.length} output objects in webhook response`);
        
        // Specifically log details about each output if they exist
        for (let i = 0; i < data.length; i++) {
          logOutputDetails(data[i], i);
        }
      } else {
        logger.info("Data is a single object, not an array");
        // Log keys for object format
        logger.info("Object keys:", Object.keys(data));
        
        // Look for specific outputs
        if (data.output) {
          logger.info("Found output property in single object");
          if (typeof data.output === 'object') {
            logger.info("Output is an object with keys:", Object.keys(data.output));
          }
        }
      }
      
      // Extract sections using our JSON parser
      const sections = extractSectionsFromJSON(data);
      
      if (sections.length > 0) {
        logger.info(`Extracted ${sections.length} sections from JSON: `, sections.map(s => s.title).join(', '));
        return sections;
      } else {
        logger.info("No sections extracted from JSON, falling back to markdown parsing");
      }
    }
  } catch (e) {
    // If JSON parsing fails, try to split content into sections
    logger.error("Error parsing content as JSON:", e);
  }
  
  // If we get here, either JSON parsing failed or the structure wasn't as expected
  // Fallback to legacy method to split into sections
  logger.info("Falling back to markdown parsing for content");
  const markdownSections = splitIntoSections(content);
  logger.info(`Extracted ${markdownSections.length} sections from markdown parsing`);
  return markdownSections;
};

/**
 * Log details about an output item from webhook response
 */
function logOutputDetails(item: any, index: number) {
  const output = item?.output;
  if (output) {
    if (typeof output === 'string') {
      logger.info(`Output ${index+1} is a string (possibly markdown) - first 50 chars:`, output.substring(0, 50));
    } else if (typeof output === 'object') {
      logger.info(`Output ${index+1} is an object with keys:`, Object.keys(output));
      
      // Log more details about specific structures we're looking for
      if (output.summary) logger.info(`Output ${index+1} has a summary field`);
      if (output.objective) logger.info(`Output ${index+1} has an objective field`);
      if (output.outcome) logger.info(`Output ${index+1} has an outcome field with possible insights and implications`);
      if (output.canvass) logger.info(`Output ${index+1} has a canvass field with possible definition, format, and questions`);
      if (output.activation_add_ons) logger.info(`Output ${index+1} has activation_add_ons field`);
    }
  } else {
    logger.info(`Output ${index+1} is missing or does not have an output property`);
  }
}
