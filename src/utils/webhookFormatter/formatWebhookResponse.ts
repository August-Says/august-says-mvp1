
import { formatFirstOutput } from './formatters/formatFirstOutput';
import { formatSecondOutput } from './formatters/formatSecondOutput';
import { formatThirdOutput } from './formatters/formatThirdOutput';
import { formatFourthOutput } from './formatters/formatFourthOutput';
import { formatGenericOutput } from './formatters/formatGenericOutput';
import { formatStructuredResponse } from './formatters/formatStructuredResponse';

/**
 * Formats webhook response data into a readable string format based on a specific schema
 */
export const formatWebhookResponse = (responseData: any): string => {
  try {
    // Handle array responses (common from n8n webhooks)
    if (Array.isArray(responseData)) {
      // Format all items in the array to ensure we capture all outputs
      const formattedItems = responseData
        .map((item, index) => {
          if (!item) return '';
          
          // Extract the data from the item
          const data = item.output || item.json || item;
          
          // Format based on the item's position in the array
          if (index === 0) {
            return formatFirstOutput(data);
          } else if (index === 1) {
            return formatSecondOutput(data);
          } else if (index === 2) {
            return formatThirdOutput(data);
          } else if (index === 3) {
            return formatFourthOutput(data);
          } else {
            return formatGenericOutput(data, `Additional Output ${index + 1}`);
          }
        })
        .filter(Boolean)
        .join('\n\n---\n\n');
      
      return formattedItems || 'No valid data found in response';
    } 
    
    // Handle single object response
    return formatStructuredResponse(responseData);
  } catch (error) {
    console.error('Error formatting webhook response:', error);
    return typeof responseData === 'string' 
      ? responseData 
      : JSON.stringify(responseData, null, 2);
  }
};
