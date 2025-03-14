
import { Section } from '../types';
import { OutputStructure } from './types';
import { logger } from '../logger';

/**
 * Process the first output object (summary and objective)
 */
export const processFirstOutput = (output: string | OutputStructure): Section[] => {
  const sections: Section[] = [];
  logger.info("Processing first output object:", typeof output);
  
  // Handle string output (markdown)
  if (typeof output === 'string') {
    try {
      // Try to parse as JSON if it's a stringified JSON
      const parsedOutput = JSON.parse(output);
      logger.info("Successfully parsed string output as JSON");
      
      // Process as object
      if (parsedOutput.summary) {
        sections.push({
          title: "Summary",
          content: parsedOutput.summary
        });
        logger.info("Added summary section from parsed JSON string");
      }
      
      if (parsedOutput.objective) {
        sections.push({
          title: "Objective",
          content: parsedOutput.objective
        });
        logger.info("Added objective section from parsed JSON string");
      }
    } catch (e) {
      // If it's just markdown, add as a section
      sections.push({
        title: "Summary",
        content: output
      });
      logger.info("Added summary section from string output");
    }
  } else if (output && typeof output === 'object') {
    // If we have summary in the output
    if (output.summary) {
      sections.push({
        title: "Summary",
        content: output.summary
      });
      logger.info("Added summary section from JSON output");
    }
    
    // If we have objective in the output
    if (output.objective) {
      sections.push({
        title: "Objective",
        content: output.objective
      });
      logger.info("Added objective section from JSON output");
    }
  }
  
  return sections;
};
