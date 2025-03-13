
import { FormField, FormSelectWithCustomOption } from '@/components/ui/FormComponents';
import { FormData } from '@/hooks/useFormSubmission';
import * as options from '@/constants/formOptions';

interface UserRoleSectionProps {
  formData: FormData;
  errors: Record<string, string>;
  onChange: (field: keyof FormData, value: string) => void;
}

const UserRoleSection = ({ formData, errors, onChange }: UserRoleSectionProps) => {
  return (
    <FormField 
      label="Your Role" 
      htmlFor="role" 
      error={errors.role}
    >
      <FormSelectWithCustomOption
        id="role"
        value={formData.role}
        onChange={(value) => onChange('role', value)}
        options={options.roleOptions}
        placeholder="Select your role"
        error={errors.role}
        customOptionLabel="Other role (specify)"
      />
    </FormField>
  );
};

export default UserRoleSection;
