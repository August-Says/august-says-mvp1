
import { Section } from './types';

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
          
          console.log("Added summary section from string output");
        }
      }
      
      // If we have summary in the output
      if (output.summary) {
        sections.push({
          title: "Summary",
          content: output.summary
        });
        console.log("Added summary section from JSON output");
      }
      
      // If we have objective in the output
      if (output.objective) {
        sections.push({
          title: "Objective",
          content: output.objective
        });
        console.log("Added objective section from JSON output");
      }
    } else {
      console.log("No first output object found or it has no output property");
    }
    
    // Second output object - outcome with insights and strategic implications
    if (data[1] && data[1].output) {
      let output = data[1].output;
      console.log("Processing second output object:", typeof output);
      
      // Handle string output (markdown)
      if (typeof output === 'string') {
        try {
          output = JSON.parse(output);
          console.log("Successfully parsed string output as JSON");
        } catch (e) {
          sections.push({
            title: "Outcome",
            content: output
          });
          console.log("Added outcome section from string output");
        }
      }
      
      // Process structured outcome object
      if (output && typeof output === 'object') {
        if (output.outcome) {
          // Process insights
          if (output.outcome.insights && Array.isArray(output.outcome.insights)) {
            console.log(`Processing ${output.outcome.insights.length} insights`);
            output.outcome.insights.forEach((insight: any) => {
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
          if (output.outcome.strategic_implications && Array.isArray(output.outcome.strategic_implications)) {
            console.log(`Processing ${output.outcome.strategic_implications.length} strategic implications`);
            const implications = output.outcome.strategic_implications.map(
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
        } else {
          console.log("No outcome object found in second output");
        }
      }
    } else {
      console.log("No second output object found or it has no output property");
    }
    
    // Third output object - canvass with definition, format and questions
    if (data[2] && data[2].output) {
      let output = data[2].output;
      console.log("Processing third output object:", typeof output);
      
      // Handle string output (markdown)
      if (typeof output === 'string') {
        try {
          output = JSON.parse(output);
          console.log("Successfully parsed string output as JSON");
        } catch (e) {
          sections.push({
            title: "Canvass Information",
            content: output
          });
          console.log("Added canvass information from string output");
        }
      }
      
      // Process structured canvass object
      if (output && typeof output === 'object') {
        if (output.canvass) {
          // Process canvass definition
          if (output.canvass.definition) {
            sections.push({
              title: "What is a Canvass",
              content: output.canvass.definition
            });
            console.log("Added canvass definition section");
          }
          
          // Process recommended format
          if (output.canvass.recommended_format) {
            sections.push({
              title: "Recommended Canvass Format",
              content: output.canvass.recommended_format
            });
            console.log("Added recommended canvass format section");
          }
          
          // Process questions
          if (output.canvass.questions && Array.isArray(output.canvass.questions)) {
            console.log(`Processing ${output.canvass.questions.length} canvass questions`);
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
            console.log("Added questions section");
          } else {
            console.log("No questions array found in canvass");
          }
        } else {
          console.log("No canvass object found in third output");
        }
      }
    } else {
      console.log("No third output object found or it has no output property");
    }
    
    // Fourth output object - activation add-ons
    if (data[3] && data[3].output) {
      let output = data[3].output;
      console.log("Processing fourth output object:", typeof output);
      
      // Handle string output (markdown)
      if (typeof output === 'string') {
        try {
          output = JSON.parse(output);
          console.log("Successfully parsed string output as JSON");
        } catch (e) {
          sections.push({
            title: "Activation Add-ons",
            content: output
          });
          console.log("Added activation add-ons from string output");
        }
      }
      
      // Process structured activation_add_ons
      if (output && typeof output === 'object') {
        if (output.activation_add_ons && Array.isArray(output.activation_add_ons)) {
          console.log(`Processing ${output.activation_add_ons.length} activation add-ons`);
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
          console.log("Added activation add-ons section");
        } else {
          console.log("No activation_add_ons array found");
        }
      }
    } else {
      console.log("No fourth output object found or it has no output property");
    }
    
    console.log(`Extracted ${sections.length} sections from webhook outputs array`);
    
    // If we couldn't extract any sections through the structured approach,
    // attempt to process each output item as a complete markdown section
    if (sections.length === 0) {
      console.log("No sections extracted via structured approach, trying direct output processing");
      for (let i = 0; i < data.length; i++) {
        if (data[i] && data[i].output) {
          const output = data[i].output;
          if (typeof output === 'string' && output.trim()) {
            sections.push({
              title: `Output ${i+1}`,
              content: output.trim()
            });
            console.log(`Added Output ${i+1} as a direct section`);
          } else if (typeof output === 'object') {
            const content = JSON.stringify(output, null, 2);
            sections.push({
              title: `Output ${i+1}`,
              content: content
            });
            console.log(`Added Output ${i+1} as a JSON-stringified section`);
          }
        }
      }
    }
    
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
