
/**
 * Formats a response object according to the expected schema structure
 */
export const formatStructuredResponse = (data: any): string => {
  // Check if data matches our expected schema format
  if (!data) return 'No data received';
  
  let formattedContent = '';
  
  // Try to handle the expected schema
  try {
    // Add report title if available
    if (data.report_title) {
      formattedContent += `# ${data.report_title}\n\n`;
    }
    
    // Format Introduction section
    if (data.introduction) {
      if (data.introduction.Summary) {
        formattedContent += `## Summary\n${data.introduction.Summary}\n\n`;
      }
      
      if (data.introduction.Objective) {
        formattedContent += `## Objective\n${data.introduction.Objective}\n\n`;
      }
    }
    
    // Format Canvass section
    if (data.canvass) {
      if (data.canvass.definition) {
        formattedContent += `## What is a Canvass\n${data.canvass.definition}\n\n`;
      }
      
      if (data.canvass.recommended_format) {
        formattedContent += `## Recommended Canvass Format\n${data.canvass.recommended_format}\n\n`;
      }
      
      // Format questions
      if (data.canvass.questions && Array.isArray(data.canvass.questions)) {
        formattedContent += `## Questions\n\n`;
        
        data.canvass.questions.forEach((q: any, i: number) => {
          formattedContent += `### Question ${i+1}: ${q.question}\n`;
          if (q.options && Array.isArray(q.options)) {
            formattedContent += 'Options:\n';
            q.options.forEach((opt: string) => {
              formattedContent += `- ${opt}\n`;
            });
          }
          formattedContent += '\n';
        });
      }
    }
    
    // Format Outcome section
    if (data.outcome) {
      // Format insights
      if (data.outcome.insights && Array.isArray(data.outcome.insights)) {
        formattedContent += `## Key Insights\n\n`;
        
        data.outcome.insights.forEach((insight: any, i: number) => {
          formattedContent += `### ${insight.category}\n${insight.description}\n\n`;
        });
      }
      
      // Format strategic implications
      if (data.outcome.strategic_implications && Array.isArray(data.outcome.strategic_implications)) {
        formattedContent += `## Strategic Implications\n\n`;
        
        data.outcome.strategic_implications.forEach((implication: string, i: number) => {
          formattedContent += `${i+1}. ${implication}\n\n`;
        });
      }
    }
    
    // Format Activation Add-ons
    if (data.activation_add_ons && Array.isArray(data.activation_add_ons)) {
      formattedContent += `## Activation Add-ons\n\n`;
      
      data.activation_add_ons.forEach((addon: any, i: number) => {
        formattedContent += `### ${i+1}. ${addon.strategy}\n\n`;
        if (addon.details) {
          formattedContent += `**Execution Plan**: ${addon.details}\n\n`;
        }
        if (addon.copy_example) {
          formattedContent += `**Copy Example**: *${addon.copy_example}*\n\n`;
        }
      });
    }
    
    return formattedContent.trim() || JSON.stringify(data, null, 2);
  } catch (error) {
    console.error('Error in structured formatting:', error);
    
    // Fallback to original formatting approach
    if (typeof data === 'string') {
      return data;
    } else if (typeof data === 'object') {
      return Object.entries(data)
        .map(([key, value]) => {
          if (typeof value === 'object') {
            return `## ${key}\n${JSON.stringify(value, null, 2)}`;
          }
          return `## ${key}\n${value}`;
        })
        .join('\n\n');
    }
    
    return JSON.stringify(data, null, 2);
  }
};
