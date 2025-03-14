
/**
 * Format the fourth output (activation add-ons)
 */
export const formatFourthOutput = (data: any): string => {
  if (!data) return '';
  
  let formattedContent = '';
  
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
  
  return formattedContent.trim();
};
