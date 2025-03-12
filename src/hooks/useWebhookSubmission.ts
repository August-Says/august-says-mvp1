
import { useState } from 'react';
import { toast } from 'sonner';

interface WebhookOptions {
  webhookUrl?: string;
}

interface SubmissionHistory {
  result: string;
  params: Record<string, string>;
  contentValue?: string;
}

export const useWebhookSubmission = (options?: WebhookOptions) => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [submissionHistory, setSubmissionHistory] = useState<SubmissionHistory[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);

  // Updated to a more reliable, CORS-enabled test webhook endpoint
  const defaultWebhookUrl = 'https://webhook.site/fe6d08bb-574a-4a38-91ed-b5eb397528d9';
  const webhookUrl = options?.webhookUrl || defaultWebhookUrl;

  const navigateHistory = (direction: 'back' | 'forward') => {
    const newIndex = direction === 'back' ? currentHistoryIndex - 1 : currentHistoryIndex + 1;
    if (newIndex >= 0 && newIndex < submissionHistory.length) {
      setCurrentHistoryIndex(newIndex);
      setResult(submissionHistory[newIndex].result);
      return submissionHistory[newIndex];
    }
    return null;
  };

  const callWebhook = async (
    params: Record<string, string>,
    contentKey?: string,
    contentValue?: string
  ) => {
    setIsLoading(true);
    
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      
      // Add all params to query
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          queryParams.append(key, value);
        }
      });
      
      // If content key and value are provided, add them
      if (contentKey && contentValue) {
        queryParams.append(contentKey, contentValue);
        console.log(`Sending ${contentKey} to webhook:`, contentValue.substring(0, 100) + '...');
      }
      
      // Full URL for logging
      const fullUrl = `${webhookUrl}?${queryParams.toString()}`;
      console.log('Making request to:', fullUrl);
      
      // Try POST request first (more reliable for large data)
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
        
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...params,
            ...(contentKey && contentValue ? { [contentKey]: contentValue } : {})
          }),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`Webhook responded with status: ${response.status}`);
        }
        
        const responseText = await response.text();
        console.log('Raw response:', responseText);
        
        try {
          const responseData = responseText ? JSON.parse(responseText) : null;
          console.log('Webhook response:', responseData);
          
          let resultData;
          if (responseData) {
            if (Array.isArray(responseData)) {
              const combinedOutput = responseData
                .map(item => item.output || item.canvas || '')
                .join('\n\n---\n\n');
              resultData = combinedOutput;
            } else {
              resultData = responseData.output || responseData.canvas || JSON.stringify(responseData);
            }
            
            const historyEntry: SubmissionHistory = {
              result: resultData,
              params,
              contentValue
            };
            setSubmissionHistory(prev => [...prev, historyEntry]);
            setCurrentHistoryIndex(prev => prev + 1);
            
            setResult(resultData);
            toast.success('Canvas generated successfully!');
            return responseData;
          } else {
            throw new Error('No data received from webhook');
          }
        } catch (parseError) {
          console.warn('Response was not JSON, using as plain text');
          const resultData = responseText || 'No content generated, please try again.';
          
          const historyEntry: SubmissionHistory = {
            result: resultData,
            params,
            contentValue
          };
          setSubmissionHistory(prev => [...prev, historyEntry]);
          setCurrentHistoryIndex(prev => prev + 1);
          
          setResult(resultData);
          toast.success('Canvas generated successfully!');
          return { output: resultData };
        }
      } catch (fetchError) {
        console.error('Fetch error:', fetchError);
        throw new Error(`Failed to connect to webhook: ${fetchError.message}`);
      }
    } catch (error) {
      console.error('Webhook error:', error);
      toast.error(`Failed to generate content: ${error.message}`);
      
      // Set error message 
      const errorMessage = 'No content generated, please try again.';
      
      // Add error message to history
      const historyEntry: SubmissionHistory = {
        result: errorMessage,
        params,
        contentValue
      };
      setSubmissionHistory(prev => [...prev, historyEntry]);
      setCurrentHistoryIndex(prev => prev + 1);
      
      setResult(errorMessage);
      return { output: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    result,
    setResult,
    callWebhook,
    navigateHistory,
    hasHistory: submissionHistory.length > 0,
    canGoBack: currentHistoryIndex > 0,
    canGoForward: currentHistoryIndex < submissionHistory.length - 1,
    currentHistoryEntry: submissionHistory[currentHistoryIndex]
  };
};
