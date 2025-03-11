
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

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
  
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    
    setIsLoading(true);
    
    try {
      const webhookUrl = 'https://sonarai.app.n8n.cloud/webhook-test/715d27f7-f730-437c-8abe-cda82e04210e';
      const queryParams = new URLSearchParams();
      
      // Log the form data being sent
      console.log('Sending form data to webhook:', formData);
      
      Object.entries(formData).forEach(([key, value]) => {
        if (value) {
          queryParams.append(key, value);
        }
      });
      
      const fullUrl = `${webhookUrl}?${queryParams.toString()}`;
      console.log('Making request to:', fullUrl);
      
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Webhook responded with status: ${response.status}`);
      }
      
      // Get the raw response text first for debugging
      const responseText = await response.text();
      console.log('Raw response:', responseText);
      
      // Handle the response more carefully
      let data;
      try {
        data = responseText ? JSON.parse(responseText) : null;
        console.log('Parsed response data:', data);
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
        throw new Error('Invalid response format from server');
      }
      
      // Extract canvas content from the response
      // The response format might be different than expected
      let canvasContent = '';
      
      if (data) {
        // Try different possible response structures
        if (data.canvas) {
          canvasContent = data.canvas;
        } else if (Array.isArray(data) && data.length > 0) {
          // If it's an array, try to find an object with output or canvas property
          const firstItem = data[0];
          canvasContent = firstItem.canvas || firstItem.output || JSON.stringify(firstItem);
        } else if (typeof data === 'object') {
          // If it's an object with no canvas property, stringify it
          canvasContent = data.output || JSON.stringify(data);
        } else if (typeof data === 'string') {
          // If it's already a string
          canvasContent = data;
        }
      }
      
      console.log('Extracted canvas content:', canvasContent);
      
      if (canvasContent) {
        setResult(canvasContent);
        toast.success('Canvas generated successfully!');
      } else {
        console.warn('No canvas content found in response, using fallback');
        setResult(generateFallbackCanvas(formData));
        toast.info('Used fallback canvas data');
      }
    } catch (error) {
      console.error('Webhook error:', error);
      toast.error('Failed to generate canvas. Using fallback data.');
      // Use fallback data on error
      setResult(generateFallbackCanvas(formData));
    } finally {
      setIsLoading(false);
    }
  };

  // Generate fallback canvas in case of API failure
  const generateFallbackCanvas = (data: FormData) => {
    return `# Marketing Canvas for ${data.clientName}

## Executive Summary
A strategic marketing canvas designed for ${data.clientName} targeting ${data.targetAudience} in ${data.location}. This canvas focuses on ${data.productService} with emphasis on ${data.relationalSentiment}.

## Target Audience
The primary audience comprises ${data.targetAudience} with specific needs related to ${data.productService} in the ${data.clientIndustry} sector.

## Key Messages
1. Emphasize trust and reliability in all communications
2. Focus on unique selling propositions of ${data.productService}
3. Address customer pain points around ${data.relationalSentiment}

## Channel Strategy
Multi-channel approach leveraging digital and traditional media to reach ${data.targetAudience} in ${data.location}.

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
- Customer satisfaction related to ${data.relationalSentiment}
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
