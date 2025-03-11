
import { FormField, FormSelect, FormRadioGroup } from '@/components/ui/FormComponents';
import { FormData } from '@/hooks/useFormSubmission';
import * as options from '@/constants/formOptions';

interface ClientInfoSectionProps {
  formData: FormData;
  errors: Record<string, string>;
  onChange: (field: keyof FormData, value: string) => void;
}

const ClientInfoSection = ({ formData, errors, onChange }: ClientInfoSectionProps) => {
  return (
    <>
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
    </>
  );
};

export default ClientInfoSection;
