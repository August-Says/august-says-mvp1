
import { Section } from '../types';

/**
 * Extracts sections from a single object following our schema format
 */
export const extractSectionsFromSingleObject = (data: any): Section[] => {
  if (!data) return [];
  
  const sections: Section[] = [];
  
  console.log("Processing single object response");
  
  // Process Report Title
  if (data.report_title) {
    sections.push({
      title: "Report Title",
      content: data.report_title
    });
    console.log("Added report title section");
  }
  
  // Process Introduction section
  if (data.introduction) {
    if (data.introduction.Summary) {
      sections.push({
        title: "Summary",
        content: data.introduction.Summary
      });
      console.log("Added summary section from introduction");
    }
    
    if (data.introduction.Objective) {
      sections.push({
        title: "Objective",
        content: data.introduction.Objective
      });
      console.log("Added objective section from introduction");
    }
  }
  
  // Process Canvass section
  if (data.canvass) {
    if (data.canvass.definition) {
      sections.push({
        title: "What is a Canvass",
        content: data.canvass.definition
      });
      console.log("Added canvass definition section");
    }
    
    if (data.canvass.recommended_format) {
      sections.push({
        title: "Recommended Canvass Format",
        content: data.canvass.recommended_format
      });
      console.log("Added recommended canvass format section");
    }
    
    if (data.canvass.questions && Array.isArray(data.canvass.questions)) {
      console.log(`Processing ${data.canvass.questions.length} canvass questions`);
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
      console.log("Added questions section");
    }
  }
  
  // Process Outcome section
  if (data.outcome) {
    // Process insights
    if (data.outcome.insights && Array.isArray(data.outcome.insights)) {
      console.log(`Processing ${data.outcome.insights.length} insights`);
      data.outcome.insights.forEach((insight: any) => {
        sections.push({
          title: insight.category,
          content: insight.description
        });
        console.log(`Added insight section: ${insight.category}`);
      });
    }
    
    // Process strategic implications
    if (data.outcome.strategic_implications && Array.isArray(data.outcome.strategic_implications)) {
      console.log(`Processing ${data.outcome.strategic_implications.length} strategic implications`);
      const implications = data.outcome.strategic_implications.map(
        (imp: string, i: number) => `${i+1}. ${imp}`
      ).join('\n\n');
      
      sections.push({
        title: "Strategic Implications",
        content: implications
      });
      console.log("Added strategic implications section");
    }
  }
  
  // Process Activation Add-ons
  if (data.activation_add_ons && Array.isArray(data.activation_add_ons)) {
    console.log(`Processing ${data.activation_add_ons.length} activation add-ons`);
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
    console.log("Added activation add-ons section");
  }
  
  // If no sections were extracted but we have output properties
  if (sections.length === 0) {
    // Try to extract from output property directly
    if (data.output) {
      if (typeof data.output === 'string') {
        sections.push({
          title: "Output",
          content: data.output
        });
        console.log("Added direct output section from string");
      } else if (typeof data.output === 'object') {
        // Check for common structures we handle
        if (data.output.summary) {
          sections.push({
            title: "Summary",
            content: data.output.summary
          });
          console.log("Added summary from output object");
        }
        
        if (data.output.objective) {
          sections.push({
            title: "Objective",
            content: data.output.objective
          });
          console.log("Added objective from output object");
        }
      }
    }
    
    // If still no sections, just stringify the whole object as a single section
    if (sections.length === 0) {
      sections.push({
        title: "Content",
        content: JSON.stringify(data, null, 2)
      });
      console.log("Added stringified object as content section");
    }
  }
  
  console.log(`Extracted ${sections.length} sections from single object`);
  return sections;
};
