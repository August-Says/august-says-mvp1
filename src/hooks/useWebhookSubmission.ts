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
  const [lastRawResponse, setLastRawResponse] = useState<string>('');

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

  const navigateHistory = (direction: 'back' | 'forward') => {
    const newIndex = direction === 'back' ? currentHistoryIndex - 1 : currentHistoryIndex + 1;
    if (newIndex >= 0 && newIndex < submissionHistory.length) {
      setCurrentHistoryIndex(newIndex);
      setResult(submissionHistory[newIndex].result);
      return submissionHistory[newIndex];
    }
    return null;
  };

  const formatWebhookResponse = (responseData: any): string => {
    if (Array.isArray(responseData)) {
      const formattedContent = responseData
        .map((item, index) => {
          if (!item || !item.output) return '';
          
          const output = item.output;
          
          if (typeof output === 'string') {
            return output;
          } else if (typeof output === 'object') {
            if (output.Summary) {
              return `# Summary\n\n${output.Summary}`;
            } else if (output.outcome) {
              let formattedOutcome = '';
              
              if (output.outcome.insights && Array.isArray(output.outcome.insights)) {
                formattedOutcome += '## Key Insights\n\n';
                output.outcome.insights.forEach((insight: any, i: number) => {
                  formattedOutcome += `### ${insight.category}\n${insight.description}\n\n`;
                });
              }
              
              if (output.outcome['Strategic Implications'] && Array.isArray(output.outcome['Strategic Implications'])) {
                formattedOutcome += '## Strategic Implications\n\n';
                output.outcome['Strategic Implications'].forEach((implication: string, i: number) => {
                  formattedOutcome += `${i+1}. ${implication}\n`;
                });
              }
              
              return formattedOutcome;
            } else if (output.questions) {
              let formattedQuestions = `# ${output['Recommended Canvass'] || 'Recommended Canvass'}\n\n`;
              formattedQuestions += `${output['Canvass Definition'] || ''}\n\n`;
              formattedQuestions += '## Questions\n\n';
              
              output.questions.forEach((q: any, i: number) => {
                formattedQuestions += `### Question ${i+1}: ${q.question}\n`;
                formattedQuestions += 'Options:\n';
                q.options.forEach((opt: string, j: number) => {
                  formattedQuestions += `- ${opt}\n`;
                });
                formattedQuestions += '\n';
              });
              
              return formattedQuestions;
            } else if (output.activation_add_ons) {
              let formattedAddOns = '# Activation Add-ons\n\n';
              
              output.activation_add_ons.forEach((addon: any, i: number) => {
                formattedAddOns += `## ${i+1}. ${addon.Strategy}\n\n`;
                formattedAddOns += `**Execution Plan**: ${addon['Execution Plan']}\n\n`;
                formattedAddOns += `**Copy Example**: *${addon['Copy Example']}*\n\n`;
              });
              
              return formattedAddOns;
            } else {
              return Object.entries(output)
                .map(([key, value]) => {
                  if (typeof value === 'object') {
                    return `## ${key}\n${JSON.stringify(value, null, 2)}`;
                  }
                  return `## ${key}\n${value}`;
                })
                .join('\n\n');
            }
          }
          
          return JSON.stringify(item.output, null, 2);
        })
        .filter(Boolean)
        .join('\n\n---\n\n');
      
      return formattedContent || 'No valid data found in response';
    } else if (typeof responseData === 'object') {
      return JSON.stringify(responseData, null, 2);
    }
    
    return String(responseData);
  };

  const callWebhook = async (
    params: Record<string, string>,
    contentKey?: string,
    contentValue?: string
  ) => {
    setIsLoading(true);
    setLastRawResponse('');
    
    try {
      const queryParams = new URLSearchParams();
      
      if (params.additionalNotes) {
        queryParams.append('additionalNotes', params.additionalNotes);
        delete params.additionalNotes;
      }
      
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          queryParams.append(key, value);
        }
      });
      
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
      
      const responseText = await response.text();
      console.log('Raw response:', responseText);
      setLastRawResponse(responseText);
      
      let data;
      try {
        data = responseText ? JSON.parse(responseText) : null;
        console.log('Webhook response:', data);
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
        data = responseText;
        toast.error('Failed to parse webhook response. See console for details.');
      }
      
      if (data) {
        const formattedResult = formatWebhookResponse(data);
        
        const historyEntry: SubmissionHistory = {
          result: formattedResult,
          params,
          contentValue
        };
        setSubmissionHistory(prev => [...prev, historyEntry]);
        setCurrentHistoryIndex(prev => prev + 1);
        
        setResult(formattedResult);
        toast.success('Canvas generated successfully!');
        return data;
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
    hasHistory: submissionHistory.length > 0,
    canGoBack: currentHistoryIndex > 0,
    canGoForward: currentHistoryIndex < submissionHistory.length - 1,
    currentHistoryEntry: submissionHistory[currentHistoryIndex],
    lastRawResponse
  };
};
