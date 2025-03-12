
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useWebhookSubmission } from './useWebhookSubmission';
import { validateFormData } from '@/utils/formValidation';
import { FormData, FORM_DATA_STORAGE_KEY } from '@/types/form';

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
      relationalSentiment: ''
    };
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Use the shared webhook submission hook
  const { isLoading, result, setResult, callWebhook } = useWebhookSubmission();

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
      relationalSentiment: ''
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

  return {
    formData,
    isLoading,
    result,
    errors,
    handleChange,
    handleSubmit,
    resetForm,
    setResult
  };
};
