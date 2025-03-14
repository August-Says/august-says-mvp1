
/**
 * Centralized logging utility for content processing
 */
export const logger = {
  info: (message: string, ...args: any[]) => {
    console.log(message, ...args);
  },
  
  error: (message: string, error: any) => {
    console.error(message, error);
  }
};
