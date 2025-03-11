
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useWebhookSubmission } from './useWebhookSubmission';

export interface FormData {
  role: string;
  clientName: string;
  clientIndustry: string;
  sponsored: string;
  event: string;
  targetAudience: string;
  location: string;
  productService: string;
  relationalSentiment: string;
}

const FORM_DATA_STORAGE_KEY = 'marketing-form-data';

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

  // Use the shared webhook submission hook with a custom fallback generator
  const { isLoading, result, setResult, callWebhook } = useWebhookSubmission({
    fallbackGenerator: generateFallbackCanvas
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
      relationalSentiment: ''
    });
    setErrors({});
    toast.success('Form has been reset');
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;
    
    const requiredFields: Array<keyof FormData> = [
      'role', 'clientName', 'clientIndustry', 'sponsored', 
      'targetAudience', 'location', 'productService', 'relationalSentiment'
    ];
    
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
        isValid = false;
      }
    });
    
    if (formData.sponsored === 'Yes Sponsored' && !formData.event) {
      newErrors.event = 'Event is required for sponsored projects';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
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

  // Generate fallback canvas in case of API failure
  const generateFallbackCanvas = (data: string) => {
    // Since we're passing the entire formData object as params
    // we'll extract client details from the data parameter if possible
    // or create a generic response
    
    let clientName = "the client";
    let targetAudience = "target audience";
    let location = "the market";
    let productService = "products/services";
    let relationalSentiment = "customer needs";
    
    try {
      // Try to extract some key information from the data
      const parsedData = JSON.parse(data) as FormData;
      clientName = parsedData.clientName || clientName;
      targetAudience = parsedData.targetAudience || targetAudience;
      location = parsedData.location || location;
      productService = parsedData.productService || productService;
      relationalSentiment = parsedData.relationalSentiment || relationalSentiment;
    } catch (e) {
      // If data is not valid JSON, use the current formData
      clientName = formData.clientName || clientName;
      targetAudience = formData.targetAudience || targetAudience;
      location = formData.location || location;
      productService = formData.productService || productService;
      relationalSentiment = formData.relationalSentiment || relationalSentiment;
    }
    
    return `# Marketing Canvas for ${clientName}

## Executive Summary
A strategic marketing canvas designed for ${clientName} targeting ${targetAudience} in ${location}. This canvas focuses on ${productService} with emphasis on ${relationalSentiment}.

## Target Audience
The primary audience comprises ${targetAudience} with specific needs related to ${productService} in the ${formData.clientIndustry || "industry"} sector.

## Key Messages
1. Emphasize trust and reliability in all communications
2. Focus on unique selling propositions of ${productService}
3. Address customer pain points around ${relationalSentiment}

## Channel Strategy
Multi-channel approach leveraging digital and traditional media to reach ${targetAudience} in ${location}.

## Implementation Timeline
- Week 1-2: Initial research and concept development
- Week 3-4: Content creation and channel preparation
- Week 5-6: Campaign launch and initial monitoring
- Week 7-8: Performance review and optimization

## Budget Allocation
- Research & Strategy: 20%
- Creative Development: 30%
- Media Placement: 35%
- Monitoring & Optimization: 15%

## Success Metrics
- Engagement rates across all platforms
- Lead generation quantity and quality
- Conversion rates
- Customer satisfaction related to ${relationalSentiment}
- ROI measurement`;
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
