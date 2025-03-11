
import { useState } from 'react';
import { toast } from 'sonner';

interface WebhookOptions {
  fallbackGenerator?: (content: string) => string;
  webhookUrl?: string;
}

export const useWebhookSubmission = (options?: WebhookOptions) => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');

  const defaultWebhookUrl = 'https://sonarai.app.n8n.cloud/webhook-test/715d27f7-f730-437c-8abe-cda82e04210e';
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
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Webhook responded with status: ${response.status}`);
      }
      
      // Get the raw response text for debugging
      const responseText = await response.text();
      console.log('Raw response:', responseText);
      
      // Handle the response
      let data;
      try {
        data = responseText ? JSON.parse(responseText) : null;
        console.log('Parsed response data:', data);
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
        throw new Error('Invalid response format from server');
      }
      
      // Extract canvas content from the response
      let canvasContent = '';
      
      if (data) {
        // Try different possible response structures
        if (data.canvas) {
          canvasContent = data.canvas;
        } else if (Array.isArray(data) && data.length > 0) {
          // If it's an array, try to find an object with output or canvas property
          const firstItem = data[0];
          canvasContent = firstItem.canvas || firstItem.output || JSON.stringify(firstItem);
        } else if (typeof data === 'object') {
          // If it's an object with no canvas property, stringify it
          canvasContent = data.output || JSON.stringify(data);
        } else if (typeof data === 'string') {
          // If it's already a string
          canvasContent = data;
        }
      }
      
      console.log('Extracted canvas content:', canvasContent);
      
      if (canvasContent) {
        setResult(canvasContent);
        toast.success('Canvas generated successfully!');
        return canvasContent;
      } else {
        console.warn('No canvas content found in response, using fallback');
        const fallbackContent = fallbackGenerator(contentValue || '');
        setResult(fallbackContent);
        toast.info('Used fallback canvas data');
        return fallbackContent;
      }
    } catch (error) {
      console.error('Webhook error:', error);
      toast.error('Failed to generate canvas. Using fallback data.');
      // Use fallback data on error
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
    callWebhook
  };
};
