
import { useState } from 'react';
import { toast } from 'sonner';

interface WebhookOptions {
  fallbackGenerator?: (content: string) => string;
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

  // Test webhook URL - using a more reliable test endpoint
  const defaultWebhookUrl = 'https://webhook.site/715d27f7-f730-437c-8abe-cda82e04210e';
  const webhookUrl = options?.webhookUrl || defaultWebhookUrl;
  
  const defaultFallbackGenerator = (content: string) => {
    return `# Generated Marketing Canvas

## Executive Summary
A comprehensive marketing strategy based on the provided content.

${content.substring(0, 200)}${content.length > 200 ? '...' : ''}

## Target Audience Analysis
Detailed breakdown of primary and secondary audience segments.

## Key Messages
- Primary message: Focus on value proposition and unique selling points
- Secondary messages: Address specific audience needs and objections
- Tone and voice recommendations for consistent communication`;
  };

  const fallbackGenerator = options?.fallbackGenerator || defaultFallbackGenerator;

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
      
      let responseData;
      const fullUrl = `${webhookUrl}?${queryParams.toString()}`;
      console.log('Making request to:', fullUrl);
      
      try {
        // Attempt to make the fetch request with a timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch(fullUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
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
          responseData = responseText ? JSON.parse(responseText) : null;
          console.log('Webhook response:', responseData);
        } catch (parseError) {
          console.warn('Response was not JSON, using as plain text');
          responseData = { output: responseText };
        }
      } catch (fetchError) {
        console.error('Fetch error:', fetchError);
        throw new Error(`Failed to connect to webhook: ${fetchError.message}`);
      }
      
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
    } catch (error) {
      console.error('Webhook error:', error);
      toast.error(`Failed to generate canvas: ${error.message}. Using fallback data.`);
      
      // Always generate fallback content when there's an error
      const fallbackContent = fallbackGenerator(contentValue || '');
      
      // Add fallback to history
      const historyEntry: SubmissionHistory = {
        result: fallbackContent,
        params,
        contentValue
      };
      setSubmissionHistory(prev => [...prev, historyEntry]);
      setCurrentHistoryIndex(prev => prev + 1);
      
      setResult(fallbackContent);
      return { output: fallbackContent };
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
