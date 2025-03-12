
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

  // Fixed webhook URL - using HTTPS
  const defaultWebhookUrl = 'https://sonarai.app.n8n.cloud/webhook/715d27f7-f730-437c-8abe-cda82e04210e';
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
      // Create a URL with parameters for a POST request body
      const queryParams = new URLSearchParams();
      
      // Add all params to query
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          queryParams.append(key, value);
        }
      });
      
      // If content key and value are provided, add them
      if (contentKey && contentValue) {
        // Instead of adding to URL, prepare it for request body
        console.log(`Sending ${contentKey} to webhook:`, contentValue.substring(0, 100) + '...');
      }
      
      // Prepare request URL and data
      const fullUrl = webhookUrl;
      console.log('Making request to:', fullUrl);
      
      // Create request body
      const requestBody: Record<string, any> = {
        ...params
      };
      
      if (contentKey && contentValue) {
        requestBody[contentKey] = contentValue;
      }
      
      // Make POST request instead of GET
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Webhook responded with status: ${response.status}`);
      }
      
      const responseText = await response.text();
      console.log('Raw response:', responseText);
      
      let data;
      try {
        data = responseText ? JSON.parse(responseText) : null;
        console.log('Webhook response:', data);
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
        data = responseText;
      }
      
      let resultData;
      if (data) {
        if (Array.isArray(data)) {
          const combinedOutput = data
            .map(item => item.output || item.canvas || '')
            .join('\n\n---\n\n');
          resultData = combinedOutput;
        } else {
          resultData = data.output || data.canvas || JSON.stringify(data);
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
        return data;
      } else {
        console.log('Using fallback data because no valid response was received');
        const fallbackContent = fallbackGenerator(contentValue || '');
        setResult(fallbackContent);
        toast.info('Used fallback canvas data');
        return fallbackContent;
      }
    } catch (error) {
      console.error('Webhook error:', error);
      toast.error('Failed to generate canvas. Using fallback data.');
      const fallbackContent = fallbackGenerator(contentValue || '');
      setResult(fallbackContent);
      return fallbackContent;
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
