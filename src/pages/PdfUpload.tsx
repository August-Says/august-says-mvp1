
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

## Executive Summary
A comprehensive marketing strategy based on the provided content. This canvas outlines key objectives, target audience insights, and actionable recommendations.

## Strategic Objectives
1. Increase brand awareness among target demographics
2. Improve customer engagement metrics across channels
3. Drive conversion rates through optimized customer journeys
4. Strengthen brand positioning against competitors

**QUESTION:** How can we effectively increase brand awareness?

${content.substring(0, 200)}${content.length > 200 ? '...' : ''}

## Target Audience Analysis
Detailed breakdown of primary and secondary audience segments with behavioral patterns, preferences, and pain points identified through data analysis.

## Key Messages
- Primary message: Focus on value proposition and unique selling points
- Secondary messages: Address specific audience needs and objections
- Tone and voice recommendations for consistent communication

## Channel Strategy
Multi-channel approach with specific focus on:
- Digital (social media, content marketing, email)
- Traditional media placement
- Direct marketing initiatives
- Sales enablement

## Implementation Timeline
- Phase 1 (Weeks 1-4): Planning and asset development
- Phase 2 (Weeks 5-8): Initial launch and channel activation
- Phase 3 (Weeks 9-12): Optimization based on early performance data
- Phase 4 (Weeks 13-16): Scale successful tactics and refine approach

## Budget Allocation
Recommended budget distribution across channels and initiatives with flexibility for optimization during campaign execution.

## Success Metrics
- Brand awareness metrics
- Engagement rates
- Conversion metrics
- ROI calculations
- Customer satisfaction scores

## Risk Assessment
Potential challenges and mitigation strategies to ensure campaign resilience and adaptability.`;
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

  const loadingProgress = useProgressAnimation(isLoading);

  const handleFormSubmit = async (content: string, type: 'upload' | 'text') => {
    const params: Record<string, string> = {};
    setTextContent(content);
    
    if (type === 'text') {
      await callWebhook(params, 'textContent', content);
    } else {
      params.pdfUploaded = 'true';
      await callWebhook(params);
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
    return <LoadingContent loadingProgress={loadingProgress} />;
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
