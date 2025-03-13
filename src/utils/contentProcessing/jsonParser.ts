import { Section } from './types';

/**
 * Extracts sections from JSON data matching our expected schema
 */
export const extractSectionsFromJSON = (data: any): Section[] => {
  if (!data) return [];
  
  const sections: Section[] = [];
  
  // Handle array of outputs (from n8n webhook)
  if (Array.isArray(data)) {
    console.log("Processing array of webhook outputs", data);
    
    // Specifically process the first 4 output objects in the array
    // First output object - summary and objective
    if (data[0] && data[0].output) {
      let output = data[0].output;
      
      // Handle string output (markdown)
      if (typeof output === 'string') {
        try {
          // Try to parse as JSON if it's a stringified JSON
          output = JSON.parse(output);
        } catch (e) {
          // If it's just markdown, add as a section
          sections.push({
            title: "Summary",
            content: output
          });
          
          // Continue to next output
          return sections;
        }
      }
      
      // If we have summary in the output
      if (output.summary) {
        sections.push({
          title: "Summary",
          content: output.summary
        });
      }
      
      // If we have objective in the output
      if (output.objective) {
        sections.push({
          title: "Objective",
          content: output.objective
        });
      }
    }
    
    // Second output object - outcome with insights and strategic implications
    if (data[1] && data[1].output) {
      let output = data[1].output;
      
      // Handle string output (markdown)
      if (typeof output === 'string') {
        try {
          output = JSON.parse(output);
        } catch (e) {
          sections.push({
            title: "Outcome",
            content: output
          });
          
          // Continue processing other outputs
        }
      } else if (output.outcome) {
        // Process insights
        if (output.outcome.insights && Array.isArray(output.outcome.insights)) {
          output.outcome.insights.forEach((insight: any) => {
            if (insight.category && insight.description) {
              sections.push({
                title: insight.category,
                content: insight.description
              });
            }
          });
        }
        
        // Process strategic implications
        if (output.outcome.strategic_implications && Array.isArray(output.outcome.strategic_implications)) {
          const implications = output.outcome.strategic_implications.map(
            (imp: string, i: number) => `${i+1}. ${imp}`
          ).join('\n\n');
          
          sections.push({
            title: "Strategic Implications",
            content: implications
          });
        }
      }
    }
    
    // Third output object - canvass with definition, format and questions
    if (data[2] && data[2].output) {
      let output = data[2].output;
      
      // Handle string output (markdown)
      if (typeof output === 'string') {
        try {
          output = JSON.parse(output);
        } catch (e) {
          sections.push({
            title: "Canvass Information",
            content: output
          });
          
          // Continue processing other outputs
        }
      } else if (output.canvass) {
        // Process canvass definition
        if (output.canvass.definition) {
          sections.push({
            title: "What is a Canvass",
            content: output.canvass.definition
          });
        }
        
        // Process recommended format
        if (output.canvass.recommended_format) {
          sections.push({
            title: "Recommended Canvass Format",
            content: output.canvass.recommended_format
          });
        }
        
        // Process questions
        if (output.canvass.questions && Array.isArray(output.canvass.questions)) {
          let questionsContent = '';
          output.canvass.questions.forEach((q: any, i: number) => {
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
    }
    
    // Fourth output object - activation add-ons
    if (data[3] && data[3].output) {
      let output = data[3].output;
      
      // Handle string output (markdown)
      if (typeof output === 'string') {
        try {
          output = JSON.parse(output);
        } catch (e) {
          sections.push({
            title: "Activation Add-ons",
            content: output
          });
          
          // Continue processing other outputs
        }
      } else if (output.activation_add_ons && Array.isArray(output.activation_add_ons)) {
        let addonsContent = '';
        output.activation_add_ons.forEach((addon: any, i: number) => {
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
    }
    
    console.log(`Extracted ${sections.length} sections from webhook outputs array`);
    return sections;
  }
  
  // Handle single object with extractSectionsFromSingleObject for non-array responses
  return extractSectionsFromSingleObject(data);
};

/**
 * Extracts sections from a single object following our schema format
 */
const extractSectionsFromSingleObject = (data: any): Section[] => {
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
