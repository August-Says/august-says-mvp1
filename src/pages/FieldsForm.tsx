
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ResultDisplay from '@/components/ResultDisplay';
import MarketingForm from '@/components/MarketingForm';
import { useFormSubmission } from '@/hooks/useFormSubmission';
import { useState } from 'react';
import LinearProgressBar from '@/components/LinearProgressBar';

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
        <LinearProgressBar isLoading={true} />
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
