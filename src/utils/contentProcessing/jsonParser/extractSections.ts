
import { Section } from '../types';
import { WebhookResponse } from './types';
import { processFirstOutput } from './processFirstOutput';
import { processSecondOutput } from './processSecondOutput';
import { processThirdOutput } from './processThirdOutput';
import { processFourthOutput } from './processFourthOutput';
import { extractDirectOutputs } from './extractDirectOutputs';
import { extractSectionsFromSingleObject } from './processSingleObject';

/**
 * Extracts sections from JSON data matching our expected schema
 */
export const extractSectionsFromJSON = (data: any): Section[] => {
  if (!data) return [];
  
  const sections: Section[] = [];
  
  // Handle array of outputs (from n8n webhook)
  if (Array.isArray(data)) {
    console.log("Processing array of webhook outputs with length:", data.length);
    
    // First output object - summary and objective
    if (data[0] && data[0].output) {
      const firstSections = processFirstOutput(data[0].output);
      sections.push(...firstSections);
    } else {
      console.log("No first output object found or it has no output property");
    }
    
    // Second output object - outcome with insights and strategic implications
    if (data[1] && data[1].output) {
      const secondSections = processSecondOutput(data[1].output);
      sections.push(...secondSections);
    } else {
      console.log("No second output object found or it has no output property");
    }
    
    // Third output object - canvass with definition, format and questions
    if (data[2] && data[2].output) {
      const thirdSections = processThirdOutput(data[2].output);
      sections.push(...thirdSections);
    } else {
      console.log("No third output object found or it has no output property");
    }
    
    // Fourth output object - activation add-ons
    if (data[3] && data[3].output) {
      const fourthSections = processFourthOutput(data[3].output);
      sections.push(...fourthSections);
    } else {
      console.log("No fourth output object found or it has no output property");
    }
    
    console.log(`Extracted ${sections.length} sections from webhook outputs array`);
    
    // If we couldn't extract any sections through the structured approach,
    // attempt to process each output item as a complete markdown section
    if (sections.length === 0) {
      return extractDirectOutputs(data as WebhookResponse);
    }
    
    return sections;
  }
  
  // Handle single object with extractSectionsFromSingleObject for non-array responses
  return extractSectionsFromSingleObject(data);
};
