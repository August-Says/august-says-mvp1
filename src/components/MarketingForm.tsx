
import { Button } from '@/components/ui/button';
import { FormField, FormSelect, FormRadioGroup } from '@/components/ui/FormComponents';
import { FormData } from '@/hooks/useFormSubmission';
import * as options from '@/constants/formOptions';

interface MarketingFormProps {
  formData: FormData;
  errors: Record<string, string>;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (field: keyof FormData, value: string) => void;
}

const MarketingForm = ({ formData, errors, onSubmit, onChange }: MarketingFormProps) => {
  return (
    <form onSubmit={onSubmit} className="glass-morphism rounded-2xl p-6 sm:p-8 shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField 
          label="Your Role" 
          htmlFor="role" 
          error={errors.role}
        >
          <FormSelect
            id="role"
            value={formData.role}
            onChange={(value) => onChange('role', value)}
            options={options.roleOptions}
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
            onChange={(value) => onChange('clientName', value)}
            options={options.clientOptions}
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
            onChange={(value) => onChange('clientIndustry', value)}
            options={options.industryOptions}
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
            onChange={(value) => onChange('sponsored', value)}
            options={options.sponsoredOptions}
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
              onChange={(value) => onChange('event', value)}
              options={options.eventOptions}
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
            onChange={(value) => onChange('targetAudience', value)}
            options={options.audienceOptions}
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
            onChange={(value) => onChange('location', value)}
            options={options.locationOptions}
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
            onChange={(value) => onChange('productService', value)}
            options={options.productOptions}
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
            onChange={(value) => onChange('relationalSentiment', value)}
            options={options.sentimentOptions}
            placeholder="Select sentiment"
            error={errors.relationalSentiment}
          />
        </FormField>
      </div>
      
      <div className="mt-8 flex justify-center">
        <Button 
          type="submit" 
          variant="cloudai"
          size="lg"
          className="font-medium px-10"
        >
          Generate Canvas
        </Button>
      </div>
    </form>
  );
};

export default MarketingForm;
