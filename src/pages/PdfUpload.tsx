
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
  
  const { 
    isLoading, 
    result, 
    setResult, 
    callWebhook,
    navigateHistory,
    canGoBack,
    canGoForward
  } = useWebhookSubmission();

  const loadingProgress = useProgressAnimation(isLoading);

  const handleFormSubmit = async (content: string, type: 'upload' | 'text') => {
    const params: Record<string, string> = {};
    setTextContent(content);
    
    await callWebhook(params, 'textContent', content);
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
