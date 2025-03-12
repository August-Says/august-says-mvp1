
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWebhookSubmission } from '@/hooks/useWebhookSubmission';
import { useProgressAnimation } from '@/hooks/useProgressAnimation';
import LoadingContent from '@/components/pdf/LoadingContent';
import ResultContent from '@/components/pdf/ResultContent';
import UploadFormContent from '@/components/pdf/UploadFormContent';

const PdfUpload = () => {
  const navigate = useNavigate();
  const [textContent, setTextContent] = useState('');
  
  const generateFallbackCanvas = (content: string) => {
    return `# Generated Marketing Canvas

## SUMMARY
A comprehensive marketing strategy based on the provided content. This canvas outlines key objectives, target audience insights, and actionable recommendations.

## OBJECTIVE
1. Increase brand awareness among target demographics
2. Improve customer engagement metrics across channels
3. Drive conversion rates through optimized customer journeys
4. Strengthen brand positioning against competitors

${content.substring(0, 200)}${content.length > 200 ? '...' : ''}

## THE OUTCOME
Detailed breakdown of primary and secondary audience segments with behavioral patterns, preferences, and pain points identified through data analysis.

## STRATEGIC IMPLICATIONS
- Primary message: Focus on value proposition and unique selling points
- Secondary messages: Address specific audience needs and objections
- Tone and voice recommendations for consistent communication

## WHAT IS A CANVASS
Multi-channel approach with specific focus on:
- Digital (social media, content marketing, email)
- Traditional media placement
- Direct marketing initiatives
- Sales enablement

## RECOMMENDED CANVASS FORMAT
- Phase 1 (Weeks 1-4): Planning and asset development
- Phase 2 (Weeks 5-8): Initial launch and channel activation
- Phase 3 (Weeks 9-12): Optimization based on early performance data
- Phase 4 (Weeks 13-16): Scale successful tactics and refine approach`;
  };
  
  const { 
    isLoading, 
    result, 
    setResult, 
    callWebhook,
    navigateHistory,
    canGoBack,
    canGoForward
  } = useWebhookSubmission({
    fallbackGenerator: generateFallbackCanvas
  });

  useProgressAnimation(isLoading);

  const handleFormSubmit = async (content: string, type: 'upload' | 'text') => {
    const params: Record<string, string> = {};
    console.log(`Form submit with type: ${type}, content length: ${content.length}`);
    setTextContent(content);
    
    if (type === 'text') {
      console.log('Submitting text content to webhook');
      await callWebhook(params, 'textContent', content);
    } else {
      console.log('Submitting file upload to webhook');
      params.pdfUploaded = 'true';
      await callWebhook(params, 'pdfContent', content);
    }
  };

  const handleHistoryNavigation = (direction: 'back' | 'forward') => {
    const historyEntry = navigateHistory(direction);
    if (historyEntry?.contentValue) {
      setTextContent(historyEntry.contentValue);
    }
  };
  
  const handleBack = () => {
    if (result) {
      setResult('');
    } else {
      navigate('/');
    }
  };

  if (isLoading) {
    return <LoadingContent message="Generating your marketing canvas..." />;
  }
  
  if (result) {
    return (
      <ResultContent
        result={result}
        onBack={handleBack}
        onNavigate={handleHistoryNavigation}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
      />
    );
  }

  return (
    <UploadFormContent
      onBack={handleBack}
      onSubmit={handleFormSubmit}
      textContent={textContent}
    />
  );
};

export default PdfUpload;
