
import { FormField, FormSelect } from '@/components/ui/FormComponents';
import { FormData } from '@/hooks/useFormSubmission';
import * as options from '@/constants/formOptions';

interface ProductSectionProps {
  formData: FormData;
  errors: Record<string, string>;
  onChange: (field: keyof FormData, value: string) => void;
}

const ProductSection = ({ formData, errors, onChange }: ProductSectionProps) => {
  return (
    <>
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
    </>
  );
};

export default ProductSection;
