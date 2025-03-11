
import { Button } from '@/components/ui/button';
import { FormData } from '@/hooks/useFormSubmission';
import FormSection from '@/components/marketing-form/FormSection';
import UserRoleSection from '@/components/marketing-form/UserRoleSection';
import ClientInfoSection from '@/components/marketing-form/ClientInfoSection';
import EventSection from '@/components/marketing-form/EventSection';
import AudienceSection from '@/components/marketing-form/AudienceSection';
import ProductSection from '@/components/marketing-form/ProductSection';

interface MarketingFormProps {
  formData: FormData;
  errors: Record<string, string>;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (field: keyof FormData, value: string) => void;
  onReset?: () => void;
}

const MarketingForm = ({ 
  formData, 
  errors, 
  onSubmit, 
  onChange,
  onReset 
}: MarketingFormProps) => {
  return (
    <form onSubmit={onSubmit} className="glass-morphism rounded-2xl p-6 sm:p-8 shadow-lg">
      <FormSection title="Your Information">
        <UserRoleSection 
          formData={formData}
          errors={errors}
          onChange={onChange}
        />
      </FormSection>
      
      <FormSection title="Client Information">
        <ClientInfoSection 
          formData={formData}
          errors={errors}
          onChange={onChange}
        />
      </FormSection>
      
      <FormSection title="Event Details">
        <EventSection 
          formData={formData}
          errors={errors}
          onChange={onChange}
        />
      </FormSection>
      
      <FormSection title="Target Audience">
        <AudienceSection 
          formData={formData}
          errors={errors}
          onChange={onChange}
        />
      </FormSection>
      
      <FormSection title="Product & Sentiment">
        <ProductSection 
          formData={formData}
          errors={errors}
          onChange={onChange}
        />
      </FormSection>
      
      <div className="mt-8 flex justify-center gap-4">
        <Button 
          type="submit" 
          variant="cloudai"
          size="lg"
          className="font-medium px-10"
        >
          Generate Canvas
        </Button>
        
        {onReset && (
          <Button 
            type="button" 
            variant="outline"
            size="lg"
            onClick={onReset}
            className="font-medium px-6 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border-white/20"
          >
            Reset Form
          </Button>
        )}
      </div>
    </form>
  );
};

export default MarketingForm;
