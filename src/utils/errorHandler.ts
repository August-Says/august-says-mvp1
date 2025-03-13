
import { toast } from 'sonner';

/**
 * Type definitions for error handling
 */
export interface ErrorHandlerOptions {
  defaultErrorMessage?: string;
  fallbackFn?: (error: any) => void;
  showToast?: boolean;
  logToConsole?: boolean;
}

/**
 * Executes an async operation with standardized error handling
 * 
 * @param operation - The async operation to execute
 * @param options - Error handling configuration options
 * @returns The result of the operation, or null if it failed
 */
export const handleAsyncOperation = async <T>(
  operation: () => Promise<T>,
  options: ErrorHandlerOptions = {}
): Promise<T | null> => {
  const {
    defaultErrorMessage = 'An error occurred',
    fallbackFn,
    showToast = true,
    logToConsole = true
  } = options;

  try {
    return await operation();
  } catch (error: any) {
    // Log the error to console if requested
    if (logToConsole) {
      console.error('Operation error:', error);
    }

    // Show toast notification if requested
    if (showToast) {
      const errorMessage = error?.message || defaultErrorMessage;
      toast.error(errorMessage);
    }

    // Execute fallback function if provided
    if (fallbackFn) {
      fallbackFn(error);
    }

    return null;
  }
};

/**
 * Process webhook errors with standardized handling
 */
export const handleWebhookError = (
  error: any, 
  fallbackGenerator?: (content: string) => string,
  contentValue?: string
): string => {
  console.error('Webhook error:', error);
  toast.error('Failed to generate canvas. Using fallback data.');
  
  if (fallbackGenerator && contentValue) {
    return fallbackGenerator(contentValue);
  }
  
  return '';
};

/**
 * Handle cases when webhook returns no valid data
 */
export const handleEmptyWebhookResponse = (
  fallbackGenerator?: (content: string) => string,
  contentValue?: string
): string => {
  console.log('Using fallback data because no valid response was received');
  toast.warning('No data received from webhook. Using fallback content.');
  
  if (fallbackGenerator && contentValue) {
    return fallbackGenerator(contentValue);
  }
  
  return '';
};

/**
 * Handle successful webhook responses
 */
export const handleSuccessfulResponse = (message: string = 'Operation completed successfully') => {
  toast.success(message);
};
