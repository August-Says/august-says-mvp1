
import { FormData } from "@/hooks/useFormSubmission";

export const validateFormData = (formData: FormData): Record<string, string> => {
  const errors: Record<string, string> = {};
  let isValid = true;
  
  const requiredFields: Array<keyof FormData> = [
    'role', 'clientName', 'clientIndustry', 'sponsored', 
    'targetAudience', 'location', 'productService', 'relationalSentiment'
  ];
  
  requiredFields.forEach(field => {
    if (!formData[field]) {
      errors[field] = 'This field is required';
      isValid = false;
    }
  });
  
  if (formData.sponsored === 'Yes Sponsored' && !formData.event) {
    errors.event = 'Event is required for sponsored projects';
    isValid = false;
  }
  
  return errors;
};
