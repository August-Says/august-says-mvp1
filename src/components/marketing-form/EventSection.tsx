
import { FormField, FormSelect, FormRadioGroup } from '@/components/ui/FormComponents';
import { FormData } from '@/hooks/useFormSubmission';
import * as options from '@/constants/formOptions';

interface EventSectionProps {
  formData: FormData;
  errors: Record<string, string>;
  onChange: (field: keyof FormData, value: string) => void;
}

const EventSection = ({ formData, errors, onChange }: EventSectionProps) => {
  return (
    <>
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
    </>
  );
};

export default EventSection;
