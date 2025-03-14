
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ResultDisplay from '@/components/ResultDisplay';
import MarketingForm from '@/components/MarketingForm';
import { useFormSubmission } from '@/hooks/useFormSubmission';
import LoadingContent from '@/components/pdf/LoadingContent';
import { useState, useEffect } from 'react';

const FieldsForm = () => {
  const navigate = useNavigate();
  const { 
    formData, 
    isLoading, 
    result, 
    errors, 
    handleChange, 
    handleSubmit,
    resetForm,
    setResult,
    lastRawResponse
  } = useFormSubmission();

  const [showRawResponse, setShowRawResponse] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Add loading progress simulation when isLoading is true
  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    
    if (isLoading) {
      setLoadingProgress(0);
      progressInterval = setInterval(() => {
        setLoadingProgress(prev => {
          const newProgress = prev + Math.random() * 5;
          return newProgress > 95 ? 95 : newProgress;
        });
      }, 800);
    } else {
      setLoadingProgress(100);
    }
    
    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [isLoading]);

  const handleBack = () => {
    if (result) {
      setResult('');
    } else {
      navigate('/');
    }
  };

  const handleToggleRawResponse = () => {
    setShowRawResponse(prev => !prev);
  };

  if (isLoading) {
    return <LoadingContent loadingProgress={loadingProgress} />;
  }
  
  if (result) {
    return (
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in relative">
        <ResultDisplay result={result} onBack={handleBack} />
        
        {lastRawResponse && (
          <div className="fixed bottom-4 right-4 z-50">
            <Button 
              onClick={handleToggleRawResponse} 
              variant="outline"
              className="bg-purple-600/80 text-white hover:bg-purple-700"
            >
              {showRawResponse ? 'Hide Raw Response' : 'Show Raw Response'}
            </Button>
            
            {showRawResponse && (
              <div className="fixed bottom-16 right-4 w-full max-w-2xl max-h-[70vh] overflow-auto bg-black/90 p-4 rounded-lg text-white/90 text-xs font-mono z-50 shadow-xl border border-purple-500">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-white text-sm font-bold">Raw Webhook Response</h3>
                  <Button 
                    onClick={handleToggleRawResponse}
                    variant="ghost" 
                    className="h-6 w-6 p-0 text-white hover:bg-purple-800"
                  >
                    ✕
                  </Button>
                </div>
                <pre className="whitespace-pre-wrap break-words">{lastRawResponse}</pre>
              </div>
            )}
          </div>
        )}
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
          <h1 className="text-3xl font-bold text-white mb-4">Create Canvas Using Fields</h1>
          <p className="text-white/80">
            Fill in the form below to generate a customized marketing canvas for your client.
          </p>
        </div>
        
        <MarketingForm
          formData={formData}
          errors={errors}
          onSubmit={handleSubmit}
          onChange={handleChange}
          onReset={resetForm}
        />
      </div>
    </div>
  );
};

export default FieldsForm;
