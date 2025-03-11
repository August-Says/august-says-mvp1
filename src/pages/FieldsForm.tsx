
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  FormField, 
  FormSelect, 
  FormRadioGroup
} from '@/components/ui/FormComponents';
import LoadingAnimation from '@/components/LoadingAnimation';
import ResultDisplay from '@/components/ResultDisplay';

interface FormData {
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

const FieldsForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
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
  
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when field is changed
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;
    
    // Required fields
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
    
    // Conditionally required fields
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
      // Simulate API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Mocked response
      setResult(`# Marketing Canvas for ${formData.clientName}

## Executive Summary
A strategic marketing canvas designed for ${formData.clientName} targeting ${formData.targetAudience} in ${formData.location}. This canvas focuses on ${formData.productService} with emphasis on ${formData.relationalSentiment}.

## Target Audience
The primary audience comprises ${formData.targetAudience} with specific needs related to ${formData.productService} in the ${formData.clientIndustry} sector.

## Key Messages
1. Emphasize trust and reliability in all communications
2. Focus on unique selling propositions of ${formData.productService}
3. Address customer pain points around ${formData.relationalSentiment}

## Channel Strategy
Multi-channel approach leveraging digital and traditional media to reach ${formData.targetAudience} in ${formData.location}.

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
- Customer satisfaction related to ${formData.relationalSentiment}
- ROI measurement`);
      
      toast.success('Canvas generated successfully!');
    } catch (error) {
      toast.error('Failed to generate canvas. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleBack = () => {
    if (result) {
      setResult('');
    } else {
      navigate('/');
    }
  };
  
  const roleOptions = [
    { label: 'Chief Marketing Officer (CMO)', value: 'Chief Marketing Officer (CMO)' },
    { label: 'Chief Experience Officer (CXO)', value: 'Chief Experience Officer (CXO)' },
    { label: 'Chief Strategy Officer (CSO)', value: 'Chief Strategy Officer (CSO)' },
    { label: 'Director of Brand Strategy', value: 'Director of Brand Strategy' },
    { label: 'Senior Marketing Manager', value: 'Senior Marketing Manager' },
    { label: 'Head of Customer Experience', value: 'Head of Customer Experience' },
    { label: 'Director of People & Culture', value: 'Director of People & Culture' },
    { label: 'VP of HR', value: 'VP of HR' },
    { label: 'Employee Experience Lead', value: 'Employee Experience Lead' },
    { label: 'Senior Brand Strategist', value: 'Senior Brand Strategist' },
    { label: 'Engagement Consultant', value: 'Engagement Consultant' },
    { label: 'Account Director', value: 'Account Director' },
    { label: 'Customer Success Manager', value: 'Customer Success Manager' },
    { label: 'Sentiment Support Specialist', value: 'Sentiment Support Specialist' },
    { label: 'Director of Insights & Innovation', value: 'Director of Insights & Innovation' },
    { label: 'Industry Analyst', value: 'Industry Analyst' },
    { label: 'Chief Content Strategist', value: 'Chief Content Strategist' }
  ];
  
  const clientOptions = [
    { label: 'BMO Bank', value: 'BMO Bank' },
    { label: 'Ivari', value: 'Ivari' },
    { label: 'TD Bank', value: 'TD Bank' },
    { label: 'Scotiabank', value: 'Scotiabank' },
    { label: 'Sick Kids', value: 'Sick Kids' },
    { label: 'Starbucks', value: 'Starbucks' }
  ];
  
  const industryOptions = [
    { label: 'Banking', value: 'Banking' },
    { label: 'Government', value: 'Government' },
    { label: 'Healthcare', value: 'Healthcare' },
    { label: 'Retail', value: 'Retail' }
  ];
  
  const sponsoredOptions = [
    { label: 'Yes Sponsored', value: 'Yes Sponsored' },
    { label: 'Not Sponsored', value: 'Not Sponsored' }
  ];
  
  const eventOptions = [
    { label: 'Hockey Game', value: 'Hockey Game' },
    { label: 'Baseball Game', value: 'Baseball Game' },
    { label: 'Soccer Game', value: 'Soccer Game' },
    { label: 'Generic Fun Event', value: 'Generic Fun Event' },
    { label: 'Conference Booth', value: 'Conference Booth' }
  ];
  
  const audienceOptions = [
    { label: 'Everyday Consumer', value: 'Everyday Consumer' },
    { label: 'Employee', value: 'Employee' },
    { label: 'Community Member', value: 'Community Member' }
  ];
  
  const locationOptions = [
    { label: 'Toronto, ON', value: 'Toronto, ON' },
    { label: 'Kingston, ON', value: 'Kingston, ON' },
    { label: 'Edmonton, AB', value: 'Edmonton, AB' }
  ];
  
  const productOptions = [
    { label: 'Credit Cards', value: 'Credit Cards' },
    { label: 'Loans', value: 'Loans' },
    { label: 'Insurance', value: 'Insurance' },
    { label: 'Mortgages', value: 'Mortgages' },
    { label: 'Retail Items', value: 'Retail Items' }
  ];
  
  const sentimentOptions = [
    { label: 'Credit', value: 'Credit' },
    { label: 'Risk', value: 'Risk' },
    { label: 'Score', value: 'Score' },
    { label: 'Limits', value: 'Limits' },
    { label: 'Interest', value: 'Interest' },
    { label: 'Customer Service', value: 'Customer Service' },
    { label: 'Support', value: 'Support' },
    { label: 'Facilities', value: 'Facilities' },
    { label: 'Perks', value: 'Perks' },
    { label: 'Rewards Program', value: 'Rewards Program' }
  ];

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
        <LoadingAnimation />
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
        
        <form onSubmit={handleSubmit} className="glass-morphism rounded-2xl p-6 sm:p-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField 
              label="Your Role" 
              htmlFor="role" 
              error={errors.role}
            >
              <FormSelect
                id="role"
                value={formData.role}
                onChange={(value) => handleChange('role', value)}
                options={roleOptions}
                placeholder="Select your role"
                error={errors.role}
              />
            </FormField>
            
            <FormField 
              label="Client Name" 
              htmlFor="clientName" 
              error={errors.clientName}
            >
              <FormSelect
                id="clientName"
                value={formData.clientName}
                onChange={(value) => handleChange('clientName', value)}
                options={clientOptions}
                placeholder="Select client"
                error={errors.clientName}
              />
            </FormField>
            
            <FormField 
              label="Client Industry/Vertical" 
              htmlFor="clientIndustry" 
              error={errors.clientIndustry}
            >
              <FormSelect
                id="clientIndustry"
                value={formData.clientIndustry}
                onChange={(value) => handleChange('clientIndustry', value)}
                options={industryOptions}
                placeholder="Select industry"
                error={errors.clientIndustry}
              />
            </FormField>
            
            <FormField 
              label="Sponsored?" 
              htmlFor="sponsored" 
              error={errors.sponsored}
            >
              <FormRadioGroup
                id="sponsored"
                value={formData.sponsored}
                onChange={(value) => handleChange('sponsored', value)}
                options={sponsoredOptions}
                error={errors.sponsored}
              />
            </FormField>
            
            {formData.sponsored === 'Yes Sponsored' && (
              <FormField 
                label="Event" 
                htmlFor="event" 
                error={errors.event}
                className="md:col-span-2"
              >
                <FormSelect
                  id="event"
                  value={formData.event}
                  onChange={(value) => handleChange('event', value)}
                  options={eventOptions}
                  placeholder="Select event"
                  error={errors.event}
                />
              </FormField>
            )}
            
            <FormField 
              label="Target Audience" 
              htmlFor="targetAudience" 
              error={errors.targetAudience}
            >
              <FormSelect
                id="targetAudience"
                value={formData.targetAudience}
                onChange={(value) => handleChange('targetAudience', value)}
                options={audienceOptions}
                placeholder="Select audience"
                error={errors.targetAudience}
              />
            </FormField>
            
            <FormField 
              label="Location" 
              htmlFor="location" 
              error={errors.location}
            >
              <FormSelect
                id="location"
                value={formData.location}
                onChange={(value) => handleChange('location', value)}
                options={locationOptions}
                placeholder="Select location"
                error={errors.location}
              />
            </FormField>
            
            <FormField 
              label="Product/Service" 
              htmlFor="productService" 
              error={errors.productService}
            >
              <FormSelect
                id="productService"
                value={formData.productService}
                onChange={(value) => handleChange('productService', value)}
                options={productOptions}
                placeholder="Select product/service"
                error={errors.productService}
              />
            </FormField>
            
            <FormField 
              label="Relational Sentiment" 
              htmlFor="relationalSentiment" 
              error={errors.relationalSentiment}
            >
              <FormSelect
                id="relationalSentiment"
                value={formData.relationalSentiment}
                onChange={(value) => handleChange('relationalSentiment', value)}
                options={sentimentOptions}
                placeholder="Select sentiment"
                error={errors.relationalSentiment}
              />
            </FormField>
          </div>
          
          <div className="mt-8 flex justify-center">
            <Button 
              type="submit" 
              className="bg-august-purple hover:bg-august-purple/90 text-white font-medium px-10"
              size="lg"
            >
              Generate Canvas
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FieldsForm;
