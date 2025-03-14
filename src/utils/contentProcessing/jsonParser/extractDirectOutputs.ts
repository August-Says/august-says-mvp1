
import { Section } from '../types';
import { WebhookResponse } from './types';
import { logger } from '../logger';

/**
 * Extract sections directly from webhook outputs when structured approach fails
 */
export const extractDirectOutputs = (data: WebhookResponse): Section[] => {
  const sections: Section[] = [];
  
  logger.info("Extracting direct outputs with focus on specific properties");
  
  // First, try to find and combine all properties from all outputs
  const combinedProperties: Record<string, any> = {};
  
  // Process each output item
  for (let i = 0; i < data.length; i++) {
    if (data[i] && data[i].output) {
      const output = data[i].output;
      
      // Handle if output is an object
      if (output && typeof output === 'object') {
        // Extract key properties we're looking for
        if (output.summary) combinedProperties.summary = output.summary;
        if (output.objective) combinedProperties.objective = output.objective;
        if (output.canvass) combinedProperties.canvass = output.canvass;
        if (output.outcome) combinedProperties.outcome = output.outcome;
        if (output.activation_add_ons) combinedProperties.activation_add_ons = output.activation_add_ons;
        
        // Also check for properties tag if it exists
        if (output.properties && typeof output.properties === 'object') {
          if (output.properties.summary) combinedProperties.summary = output.properties.summary;
          if (output.properties.objective) combinedProperties.objective = output.properties.objective;
          if (output.properties.canvass) combinedProperties.canvass = output.properties.canvass;
          if (output.properties.outcome) combinedProperties.outcome = output.properties.outcome;
          if (output.properties.activation_add_ons) combinedProperties.activation_add_ons = output.properties.activation_add_ons;
        }
      }
    }
  }
  
  logger.info("Combined properties found:", Object.keys(combinedProperties).join(', '));
  
  // Now convert the combined properties into sections
  if (combinedProperties.summary) {
    sections.push({
      title: "Summary",
      content: combinedProperties.summary
    });
    logger.info("Added Summary section");
  }
  
  if (combinedProperties.objective) {
    sections.push({
      title: "Objective",
      content: combinedProperties.objective
    });
    logger.info("Added Objective section");
  }
  
  if (combinedProperties.canvass) {
    const canvass = combinedProperties.canvass;
    
    if (canvass.definition) {
      sections.push({
        title: "What is a Canvass",
        content: canvass.definition
      });
      logger.info("Added Canvass Definition section");
    }
    
    if (canvass.recommended_format) {
      sections.push({
        title: "Recommended Canvass Format",
        content: canvass.recommended_format
      });
      logger.info("Added Recommended Format section");
    }
    
    if (canvass.questions && Array.isArray(canvass.questions)) {
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
      logger.info("Added Questions section");
    }
  }
  
  if (combinedProperties.outcome) {
    const outcome = combinedProperties.outcome;
    
    if (outcome.insights && Array.isArray(outcome.insights)) {
      outcome.insights.forEach((insight: any) => {
        if (insight.category && insight.description) {
          sections.push({
            title: insight.category,
            content: insight.description
          });
          logger.info(`Added Insight section: ${insight.category}`);
        }
      });
    }
    
    if (outcome.strategic_implications && Array.isArray(outcome.strategic_implications)) {
      const implications = outcome.strategic_implications.map(
        (imp: string, i: number) => `${i+1}. ${imp}`
      ).join('\n\n');
      
      sections.push({
        title: "Strategic Implications",
        content: implications
      });
      logger.info("Added Strategic Implications section");
    }
  }
  
  if (combinedProperties.activation_add_ons && Array.isArray(combinedProperties.activation_add_ons)) {
    let addonsContent = '';
    combinedProperties.activation_add_ons.forEach((addon: any, i: number) => {
      addonsContent += `${i+1}. ${addon.strategy}\n\n`;
      if (addon.details) {
        addonsContent += `Execution Plan: ${addon.details}\n\n`;
      }
      if (addon.copy_example) {
        addonsContent += `Copy Example: ${addon.copy_example}\n\n`;
      }
    });
    
    sections.push({
      title: "Activation Add-ons",
      content: addonsContent
    });
    logger.info("Added Activation Add-ons section");
  }
  
  // If we still don't have any sections, fall back to the original approach
  if (sections.length === 0) {
    logger.info("No specific properties found, falling back to original approach");
    
    for (let i = 0; i < data.length; i++) {
      if (data[i] && data[i].output) {
        const output = data[i].output;
        if (typeof output === 'string' && output.trim()) {
          sections.push({
            title: `Output ${i+1}`,
            content: output.trim()
          });
          logger.info(`Added Output ${i+1} as a direct section`);
        } else if (typeof output === 'object') {
          const content = JSON.stringify(output, null, 2);
          sections.push({
            title: `Output ${i+1}`,
            content: content
          });
          logger.info(`Added Output ${i+1} as a JSON-stringified section`);
        }
      }
    }
  }
  
  return sections;
};
