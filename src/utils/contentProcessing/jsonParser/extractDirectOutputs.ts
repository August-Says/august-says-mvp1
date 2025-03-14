
import { Section } from '../types';
import { WebhookResponse } from './types';

/**
 * Extract sections directly from webhook outputs when structured approach fails
 */
export const extractDirectOutputs = (data: WebhookResponse): Section[] => {
  const sections: Section[] = [];
  
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
  
  return sections;
};
