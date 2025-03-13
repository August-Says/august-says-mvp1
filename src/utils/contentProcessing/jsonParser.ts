
import { Section } from './types';

/**
 * Extracts sections from JSON data matching our expected schema
 */
export const extractSectionsFromJSON = (data: any): Section[] => {
  if (!data) return [];
  
  const sections: Section[] = [];
  
  // Process Report Title
  if (data.report_title) {
    sections.push({
      title: "Report Title",
      content: data.report_title
    });
  }
  
  // Process Introduction section
  if (data.introduction) {
    if (data.introduction.Summary) {
      sections.push({
        title: "Summary",
        content: data.introduction.Summary
      });
    }
    
    if (data.introduction.Objective) {
      sections.push({
        title: "Objective",
        content: data.introduction.Objective
      });
    }
  }
  
  // Process Canvass section
  if (data.canvass) {
    if (data.canvass.definition) {
      sections.push({
        title: "What is a Canvass",
        content: data.canvass.definition
      });
    }
    
    if (data.canvass.recommended_format) {
      sections.push({
        title: "Recommended Canvass Format",
        content: data.canvass.recommended_format
      });
    }
    
    if (data.canvass.questions && Array.isArray(data.canvass.questions)) {
      let questionsContent = '';
      data.canvass.questions.forEach((q: any, i: number) => {
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
    }
  }
  
  // Process Outcome section
  if (data.outcome) {
    // Process insights
    if (data.outcome.insights && Array.isArray(data.outcome.insights)) {
      data.outcome.insights.forEach((insight: any) => {
        sections.push({
          title: insight.category,
          content: insight.description
        });
      });
    }
    
    // Process strategic implications
    if (data.outcome.strategic_implications && Array.isArray(data.outcome.strategic_implications)) {
      const implications = data.outcome.strategic_implications.map(
        (imp: string, i: number) => `${i+1}. ${imp}`
      ).join('\n\n');
      
      sections.push({
        title: "Strategic Implications",
        content: implications
      });
    }
  }
  
  // Process Activation Add-ons
  if (data.activation_add_ons && Array.isArray(data.activation_add_ons)) {
    let addonsContent = '';
    data.activation_add_ons.forEach((addon: any, i: number) => {
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
  }
  
  return sections;
};
