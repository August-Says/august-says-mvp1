
import { FormField, FormSelectWithCustomOption } from '@/components/ui/FormComponents';
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
        <FormSelectWithCustomOption
          id="productService"
          value={formData.productService}
          onChange={(value) => onChange('productService', value)}
          options={options.productOptions}
          placeholder="Select product/service"
          error={errors.productService}
          customOptionLabel="Other product/service (specify)"
        />
      </FormField>
      
      <FormField 
        label="Relational Sentiment" 
        htmlFor="relationalSentiment" 
        error={errors.relationalSentiment}
      >
        <FormSelectWithCustomOption
          id="relationalSentiment"
          value={formData.relationalSentiment}
          onChange={(value) => onChange('relationalSentiment', value)}
          options={options.sentimentOptions}
          placeholder="Select sentiment"
          error={errors.relationalSentiment}
          customOptionLabel="Other sentiment (specify)"
        />
      </FormField>
    </>
  );
};

export default ProductSection;
