
import { FormField, FormSelectWithCustomOption } from '@/components/ui/FormComponents';
import { FormData } from '@/hooks/useFormSubmission';
import * as options from '@/constants/formOptions';

interface AudienceSectionProps {
  formData: FormData;
  errors: Record<string, string>;
  onChange: (field: keyof FormData, value: string) => void;
}

const AudienceSection = ({ formData, errors, onChange }: AudienceSectionProps) => {
  return (
    <>
      <FormField 
        label="Target Audience" 
        htmlFor="targetAudience" 
        error={errors.targetAudience}
      >
        <FormSelectWithCustomOption
          id="targetAudience"
          value={formData.targetAudience}
          onChange={(value) => onChange('targetAudience', value)}
          options={options.audienceOptions}
          placeholder="Select audience"
          error={errors.targetAudience}
          customOptionLabel="Other audience (specify)"
        />
      </FormField>
      
      <FormField 
        label="Location" 
        htmlFor="location" 
        error={errors.location}
      >
        <FormSelectWithCustomOption
          id="location"
          value={formData.location}
          onChange={(value) => onChange('location', value)}
          options={options.locationOptions}
          placeholder="Select location"
          error={errors.location}
          customOptionLabel="Other location (specify)"
        />
      </FormField>
    </>
  );
};

export default AudienceSection;
