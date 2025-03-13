
import { Section } from './types';

/**
 * Format section titles to ensure consistent casing and naming
 */
export const formatSectionTitle = (title: string): string => {
  // Ensure title is a string
  if (typeof title !== 'string') {
    return 'Section';
  }
  
  title = title.toUpperCase();
  
  switch (title) {
    case 'SUMMARY':
      return 'Summary';
    case 'OBJECTIVE':
      return 'Objective';
    case 'THE OUTCOME':
      return 'The Outcome';
    case 'STRATEGIC IMPLICATIONS':
      return 'Strategic Implications';
    case 'WHAT IS A CANVASS':
      return 'What is a Canvass';
    case 'RECOMMENDED CANVASS FORMAT':
      return 'Recommended Canvass Format';
    case 'EMOTIONAL CONNECTION':
      return 'Emotional Connection';
    case 'TRUST AND RELIABILITY':
      return 'Trust and Reliability';
    case 'PRODUCT UNDERSTANDING AND RELEVANCE':
      return 'Product Understanding and Relevance';
    case 'VALUE PERCEPTION':
      return 'Value Perception';
    case 'CUSTOMER SUPPORT AND ENGAGEMENT':
      return 'Customer Support and Engagement';
    case 'QUESTIONS':
      return 'Questions';
    case 'ACTIVATION ADD-ONS':
      return 'Activation Add-ons';
    default:
      return title.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ');
  }
};
