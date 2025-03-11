
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LoadingAnimation from '@/components/LoadingAnimation';
import ResultDisplay from '@/components/ResultDisplay';
import MarketingForm from '@/components/MarketingForm';
import { useFormSubmission } from '@/hooks/useFormSubmission';
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
    setResult 
  } = useFormSubmission();
  
  // Simulated loading progress
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  // When loading starts, animate the progress
  useEffect(() => {
    if (isLoading) {
      setLoadingProgress(0);
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          // Slow down as it approaches 90%
          const increment = prev < 30 ? 5 : prev < 60 ? 3 : prev < 80 ? 1 : 0.5;
          const newProgress = Math.min(prev + increment, 90);
          return newProgress;
        });
      }, 300);
      
      return () => {
        clearInterval(interval);
        // When loading completes, jump to 100%
        if (isLoading) {
          setLoadingProgress(100);
        }
      };
    }
  }, [isLoading]);

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
        <LoadingAnimation progress={loadingProgress} />
      </div>
    );
  }
  
  if (result) {
    return (
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
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
