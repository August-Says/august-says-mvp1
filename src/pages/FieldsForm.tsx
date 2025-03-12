
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
  
  // Enhanced loading progress with smoother transitions
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  // When loading starts, animate the progress with improved algorithm
  useEffect(() => {
    if (isLoading) {
      setLoadingProgress(0);
      
      // Initial acceleration phase
      const accelerationPhase = setTimeout(() => {
        setLoadingProgress(5);
        
        // Create different speed phases for more realistic loading feel
        const interval = setInterval(() => {
          setLoadingProgress(prev => {
            // Different speeds for different phases to create a more natural loading experience
            if (prev < 20) {
              return prev + (Math.random() * 2 + 1); // Fast initial progress
            } else if (prev < 40) {
              return prev + (Math.random() * 1.5 + 0.8); // Slightly slower
            } else if (prev < 60) {
              return prev + (Math.random() * 1.2 + 0.5); // Medium speed
            } else if (prev < 80) {
              return prev + (Math.random() * 0.8 + 0.3); // Slower
            } else {
              return prev + (Math.random() * 0.4 + 0.1); // Very slow approaching 90%
            }
          });
        }, 250);
        
        return () => {
          clearInterval(interval);
          // When loading completes, jump to 100%
          if (isLoading) {
            setLoadingProgress(100);
          }
        };
      }, 500);
      
      return () => {
        clearTimeout(accelerationPhase);
        // When loading completes, jump to 100%
        setLoadingProgress(100);
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
