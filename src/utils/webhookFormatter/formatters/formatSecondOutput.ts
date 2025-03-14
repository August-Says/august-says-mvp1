
/**
 * Format the second output (outcome with insights and implications)
 */
export const formatSecondOutput = (data: any): string => {
  if (!data) return '';
  
  let formattedContent = '';
  
  // Format Outcome section
  if (data.outcome) {
    // Format insights as numbered list (like strategic implications)
    if (data.outcome.insights && Array.isArray(data.outcome.insights)) {
      formattedContent += `## Key Insights\n\n`;
      
      data.outcome.insights.forEach((insight: any, i: number) => {
        // Properly format with HTML-like markup to be parsed later by the markdown renderer
        formattedContent += `${i+1}. <strong>${insight.category}</strong>: ${insight.description}\n\n`;
      });
    }
    
    // Format strategic implications with bolded numbered items
    if (data.outcome.strategic_implications && Array.isArray(data.outcome.strategic_implications)) {
      formattedContent += `## Strategic Implications\n\n`;
      
      data.outcome.strategic_implications.forEach((implication: string, i: number) => {
        // Extract a title if the implication contains a colon
        if (implication.includes(': ')) {
          const [title, description] = implication.split(': ', 2);
          formattedContent += `${i+1}. <strong>${title}</strong>: ${description}\n\n`;
        } else {
          // If no colon separator, bold the entire item
          formattedContent += `${i+1}. <strong>${implication}</strong>\n\n`;
        }
      });
    }
  }
  
  return formattedContent.trim();
};
