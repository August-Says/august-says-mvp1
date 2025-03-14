
/**
 * Format the first output (summary and objective)
 */
export const formatFirstOutput = (data: any): string => {
  if (!data) return '';
  
  let formattedContent = '';
  
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
  
  return formattedContent.trim();
};
