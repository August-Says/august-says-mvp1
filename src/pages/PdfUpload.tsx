
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LoadingAnimation from '@/components/LoadingAnimation';
import ResultDisplay from '@/components/ResultDisplay';
import PdfUploadForm from '@/components/pdf/PdfUploadForm';
import { useWebhookSubmission } from '@/hooks/useWebhookSubmission';
import { toast } from 'sonner';

const PdfUpload = () => {
  const navigate = useNavigate();
  const [textContent, setTextContent] = useState('');
  const { 
    isLoading, 
    result, 
    setResult, 
    callWebhook,
    navigateHistory,
    canGoBack,
    canGoForward,
    currentHistoryEntry
  } = useWebhookSubmission({
    fallbackGenerator: generateFallbackCanvas
  });

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
    return (
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
        <LoadingAnimation message="Analyzing your document and generating canvas..." />
      </div>
    );
  }
  
  if (result) {
    return (
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
        <div className="max-w-4xl mx-auto mb-4 flex justify-between items-center">
          <Button 
            onClick={handleBack} 
            variant="ghost" 
            className="text-white/80 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Form
          </Button>
          <div className="flex gap-2">
            <Button
              onClick={() => handleHistoryNavigation('back')}
              variant="outline"
              disabled={!canGoBack}
              className="text-white border-white/20 hover:bg-white/10 disabled:opacity-50"
            >
              <ChevronLeft size={18} className="mr-1" />
              Previous
            </Button>
            <Button
              onClick={() => handleHistoryNavigation('forward')}
              variant="outline"
              disabled={!canGoForward}
              className="text-white border-white/20 hover:bg-white/10 disabled:opacity-50"
            >
              Next
              <ChevronRight size={18} className="ml-1" />
            </Button>
          </div>
        </div>
        <ResultDisplay result={result} onBack={handleBack} />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="mb-8">
        <Button 
          onClick={handleBack} 
          variant="ghost" 
          className="text-white/80 hover:text-white hover:bg-white/10"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Home
        </Button>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Create Canvas Using Document</h1>
          <p className="text-white/80">
            Upload a PDF or paste text to generate a customized marketing canvas.
          </p>
        </div>
        
        <PdfUploadForm onSubmit={handleFormSubmit} />
      </div>
    </div>
  );
};

export default PdfUpload;
