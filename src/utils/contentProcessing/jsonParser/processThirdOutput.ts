
import { Section } from '../types';
import { OutputStructure } from './types';
import { logger } from '../logger';

/**
 * Process the third output object (canvass with definition, format and questions)
 */
export const processThirdOutput = (output: string | OutputStructure): Section[] => {
  const sections: Section[] = [];
  logger.info("Processing third output object:", typeof output);
  
  // Handle string output (markdown)
  if (typeof output === 'string') {
    try {
      const parsedOutput = JSON.parse(output);
      logger.info("Successfully parsed string output as JSON");
      
      // Process structured object
      if (parsedOutput.canvass) {
        return processCanvassObject(parsedOutput.canvass);
      }
    } catch (e) {
      sections.push({
        title: "Canvass Information",
        content: output
      });
      logger.info("Added canvass information from string output");
    }
  } else if (output && typeof output === 'object') {
    // Process structured canvass object
    if (output.canvass) {
      return processCanvassObject(output.canvass);
    } else {
      logger.info("No canvass object found in third output");
    }
  }
  
  return sections;
};

/**
 * Process the canvass object with definition, format and questions
 */
const processCanvassObject = (canvass: any): Section[] => {
  const sections: Section[] = [];
  
  // Process canvass definition
  if (canvass.definition) {
    sections.push({
      title: "What is a Canvass",
      content: canvass.definition
    });
    logger.info("Added canvass definition section");
  }
  
  // Process recommended format
  if (canvass.recommended_format) {
    sections.push({
      title: "Recommended Canvass Format",
      content: canvass.recommended_format
    });
    logger.info("Added recommended canvass format section");
  }
  
  // Process questions
  if (canvass.questions && Array.isArray(canvass.questions)) {
    logger.info(`Processing ${canvass.questions.length} canvass questions`);
    let questionsContent = '';
    canvass.questions.forEach((q: any, i: number) => {
      questionsContent += `Question ${i+1}: ${q.question}\n\nOptions:\n`;
      if (q.options && Array.isArray(q.options)) {
        q.options.forEach((opt: string) => {
          questionsContent += `- ${opt}\n`;
        });
      }
      questionsContent += '\n';
    });
    
    sections.push({
      title: "Questions",
      content: questionsContent
    });
    logger.info("Added questions section");
  } else {
    logger.info("No questions array found in canvass");
  }
  
  return sections;
};
