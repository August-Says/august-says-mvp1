
/**
 * Format the second output (outcome with insights and implications)
 */
export const formatSecondOutput = (data: any): string => {
  if (!data) return '';
  
  let formattedContent = '';
  
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
  
  return formattedContent.trim();
};
