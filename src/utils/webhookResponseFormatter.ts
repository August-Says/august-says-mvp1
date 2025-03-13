
/**
 * Formats webhook response data into a readable string format
 */
export const formatWebhookResponse = (responseData: any): string => {
  if (Array.isArray(responseData)) {
    const formattedContent = responseData
      .map((item, index) => {
        if (!item || !item.output) return '';
        
        const output = item.output;
        
        if (typeof output === 'string') {
          return output;
        } else if (typeof output === 'object') {
          if (output.Summary) {
            return `# Summary\n\n${output.Summary}`;
          } else if (output.outcome) {
            let formattedOutcome = '';
            
            if (output.outcome.insights && Array.isArray(output.outcome.insights)) {
              formattedOutcome += '## Key Insights\n\n';
              output.outcome.insights.forEach((insight: any, i: number) => {
                formattedOutcome += `### ${insight.category}\n${insight.description}\n\n`;
              });
            }
            
            if (output.outcome['Strategic Implications'] && Array.isArray(output.outcome['Strategic Implications'])) {
              formattedOutcome += '## Strategic Implications\n\n';
              output.outcome['Strategic Implications'].forEach((implication: string, i: number) => {
                formattedOutcome += `${i+1}. ${implication}\n`;
              });
            }
            
            return formattedOutcome;
          } else if (output.questions) {
            let formattedQuestions = `# ${output['Recommended Canvass'] || 'Recommended Canvass'}\n\n`;
            formattedQuestions += `${output['Canvass Definition'] || ''}\n\n`;
            formattedQuestions += '## Questions\n\n';
            
            output.questions.forEach((q: any, i: number) => {
              formattedQuestions += `### Question ${i+1}: ${q.question}\n`;
              formattedQuestions += 'Options:\n';
              q.options.forEach((opt: string, j: number) => {
                formattedQuestions += `- ${opt}\n`;
              });
              formattedQuestions += '\n';
            });
            
            return formattedQuestions;
          } else if (output.activation_add_ons) {
            let formattedAddOns = '# Activation Add-ons\n\n';
            
            output.activation_add_ons.forEach((addon: any, i: number) => {
              formattedAddOns += `## ${i+1}. ${addon.Strategy}\n\n`;
              formattedAddOns += `**Execution Plan**: ${addon['Execution Plan']}\n\n`;
              formattedAddOns += `**Copy Example**: *${addon['Copy Example']}*\n\n`;
            });
            
            return formattedAddOns;
          } else {
            return Object.entries(output)
              .map(([key, value]) => {
                if (typeof value === 'object') {
                  return `## ${key}\n${JSON.stringify(value, null, 2)}`;
                }
                return `## ${key}\n${value}`;
              })
              .join('\n\n');
          }
        }
        
        return JSON.stringify(item.output, null, 2);
      })
      .filter(Boolean)
      .join('\n\n---\n\n');
    
    return formattedContent || 'No valid data found in response';
  } else if (typeof responseData === 'object') {
    return JSON.stringify(responseData, null, 2);
  }
  
  return String(responseData);
};
