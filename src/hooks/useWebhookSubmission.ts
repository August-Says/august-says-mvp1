
import { useState } from 'react';
import { toast } from 'sonner';
import { WebhookOptions, WebhookSubmissionResult } from '@/types/webhook';
import { formatWebhookResponse } from '@/utils/webhookResponseFormatter';
import { defaultFallbackGenerator } from '@/utils/fallbackContentGenerator';
import { useSubmissionHistory } from '@/hooks/useSubmissionHistory';
import { executeWebhookRequest } from '@/utils/webhookRequestHandler';

export const useWebhookSubmission = (options?: WebhookOptions): WebhookSubmissionResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [lastRawResponse, setLastRawResponse] = useState<string>('');
  
  const {
    addToHistory,
    navigateHistory,
    hasHistory,
    canGoBack,
    canGoForward,
    currentHistoryEntry
  } = useSubmissionHistory();

  const defaultWebhookUrl = 'https://sonarai.app.n8n.cloud/webhook-test/715d27f7-f730-437c-8abe-cda82e04210e';
  const webhookUrl = options?.webhookUrl || defaultWebhookUrl;
  const fallbackGenerator = options?.fallbackGenerator || defaultFallbackGenerator;

  const callWebhook = async (
    params: Record<string, string>,
    contentKey?: string,
    contentValue?: string
  ) => {
    setIsLoading(true);
    setLastRawResponse('');
    
    try {
      const response = await executeWebhookRequest({
        params,
        contentKey,
        contentValue,
        webhookUrl
      });
      
      setLastRawResponse(response.rawResponse);
      
      if (response.data) {
        const formattedResult = formatWebhookResponse(response.data);
        
        addToHistory({
          result: formattedResult,
          params,
          contentValue
        });
        
        setResult(formattedResult);
        toast.success('Canvas generated successfully!');
        return response.data;
      } else {
        console.log('Using fallback data because no valid response was received');
        toast.warning('No data received from webhook. Using fallback content.');
        const fallbackContent = fallbackGenerator(contentValue || '');
        setResult(fallbackContent);
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
    hasHistory,
    canGoBack,
    canGoForward,
    currentHistoryEntry,
    lastRawResponse
  };
};
