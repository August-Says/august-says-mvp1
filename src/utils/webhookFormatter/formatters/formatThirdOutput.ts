
/**
 * Format the third output (canvass with definition, format and questions)
 */
export const formatThirdOutput = (data: any): string => {
  if (!data) return '';
  
  let formattedContent = '';
  
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
  
  return formattedContent.trim();
};
