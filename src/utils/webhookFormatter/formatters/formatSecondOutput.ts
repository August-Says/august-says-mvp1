
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
    
    // Format strategic implications - without bolding the whole text
    if (data.outcome.strategic_implications && Array.isArray(data.outcome.strategic_implications)) {
      formattedContent += `## Strategic Implications\n\n`;
      
      data.outcome.strategic_implications.forEach((implication: string, i: number) => {
        // Just use the implication text without any bold formatting
        formattedContent += `${i+1}. ${implication}\n\n`;
      });
    }
  }
  
  return formattedContent.trim();
};
