
import { Section } from '../types';
import { OutputStructure } from './types';

/**
 * Process the second output object (outcome with insights and implications)
 */
export const processSecondOutput = (output: string | OutputStructure): Section[] => {
  const sections: Section[] = [];
  console.log("Processing second output object:", typeof output);
  
  // Handle string output (markdown)
  if (typeof output === 'string') {
    try {
      const parsedOutput = JSON.parse(output);
      console.log("Successfully parsed string output as JSON");
      
      // Process structured object
      if (parsedOutput.outcome) {
        return processOutcomeObject(parsedOutput.outcome);
      }
    } catch (e) {
      sections.push({
        title: "Outcome",
        content: output
      });
      console.log("Added outcome section from string output");
    }
  } else if (output && typeof output === 'object') {
    // Process structured outcome object
    if (output.outcome) {
      return processOutcomeObject(output.outcome);
    } else {
      console.log("No outcome object found in second output");
    }
  }
  
  return sections;
};

/**
 * Process the outcome object with insights and strategic implications
 */
const processOutcomeObject = (outcome: any): Section[] => {
  const sections: Section[] = [];
  
  // Process insights
  if (outcome.insights && Array.isArray(outcome.insights)) {
    console.log(`Processing ${outcome.insights.length} insights`);
    outcome.insights.forEach((insight: any) => {
      if (insight.category && insight.description) {
        sections.push({
          title: insight.category,
          content: insight.description
        });
        console.log(`Added insight section: ${insight.category}`);
      }
    });
  } else {
    console.log("No insights array found in outcome");
  }
  
  // Process strategic implications
  if (outcome.strategic_implications && Array.isArray(outcome.strategic_implications)) {
    console.log(`Processing ${outcome.strategic_implications.length} strategic implications`);
    const implications = outcome.strategic_implications.map(
      (imp: string, i: number) => `${i+1}. ${imp}`
    ).join('\n\n');
    
    sections.push({
      title: "Strategic Implications",
      content: implications
    });
    console.log("Added strategic implications section");
  } else {
    console.log("No strategic_implications array found in outcome");
  }
  
  return sections;
};
