
/**
 * Format generic output for unexpected data
 */
export const formatGenericOutput = (data: any, title: string): string => {
  if (!data) return '';
  
  if (typeof data === 'string') {
    return `## ${title}\n${data}`;
  } else {
    return `## ${title}\n${JSON.stringify(data, null, 2)}`;
  }
};
