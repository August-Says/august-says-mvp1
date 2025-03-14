
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useWebhookSubmission } from './useWebhookSubmission';
import { validateFormData } from '@/utils/formValidation';
import { generateMarketingCanvas } from '@/utils/canvasGenerator';
import { FormData, FORM_DATA_STORAGE_KEY } from '@/types/form';
import { processContent } from '@/utils/contentProcessing';

export type { FormData } from '@/types/form';
export { FORM_DATA_STORAGE_KEY } from '@/types/form';

export const useFormSubmission = () => {
  // Load initial form data from localStorage or use default empty values
  const [formData, setFormData] = useState<FormData>(() => {
    const savedData = localStorage.getItem(FORM_DATA_STORAGE_KEY);
    return savedData ? JSON.parse(savedData) : {
      role: '',
      clientName: '',
      clientIndustry: '',
      sponsored: '',
      event: '',
      targetAudience: '',
      location: '',
      productService: '',
      relationalSentiment: '',
      additionalNotes: ''
    };
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Use the shared webhook submission hook with a custom fallback generator
  const { 
    isLoading, 
    result, 
    setResult, 
    callWebhook, 
    lastRawResponse 
  } = useWebhookSubmission({
    fallbackGenerator: (data: string) => generateMarketingCanvas(data, formData)
  });

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(FORM_DATA_STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      role: '',
      clientName: '',
      clientIndustry: '',
      sponsored: '',
      event: '',
      targetAudience: '',
      location: '',
      productService: '',
      relationalSentiment: '',
      additionalNotes: ''
    });
    setErrors({});
    toast.success('Form has been reset');
  };

  const validateForm = (): boolean => {
    const newErrors = validateFormData(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Create a params object to pass to the webhook
    const params: Record<string, string> = {};
    
    // Add all form data to query params
    Object.entries(formData).forEach(([key, value]) => {
      if (value) {
        params[key] = value;
      }
    });
    
    // Call the webhook with the form data
    await callWebhook(params);
  };

  // Helper function to check if raw response data is valid
  const hasValidData = () => {
    if (!lastRawResponse) return false;
    try {
      const sections = processContent(lastRawResponse);
      return sections.length > 0;
    } catch (e) {
      console.error("Error processing content:", e);
      return false;
    }
  };

  // Get the best display content based on available data
  const getDisplayContent = () => {
    const shouldUseRawResponse = lastRawResponse && hasValidData();
    return shouldUseRawResponse ? lastRawResponse : result;
  };

  return {
    formData,
    isLoading,
    result: getDisplayContent(),
    errors,
    handleChange,
    handleSubmit,
    resetForm,
    setResult,
    lastRawResponse
  };
};
