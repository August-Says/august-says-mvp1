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

  const webhookUrl = options?.webhookUrl || 'https://sonarai.app.n8n.cloud/webhook/715d27f7-f730-437c-8abe-cda82e04210e';
  
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
      
      const fullUrl = `${webhookUrl}?${queryParams.toString()}`;
      console.log('Making request to:', fullUrl);
      
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          params: Object.fromEntries(queryParams),
          content: contentValue || ''
        })
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
        toast.error('No content generated, please try again.');
        return null;
      }
    } catch (error) {
      console.error('Webhook error:', error);
      toast.error('No content generated, please try again.');
      return null;
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
