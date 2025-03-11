
import { ReactNode } from 'react';

interface FormSectionProps {
  title: string;
  children: ReactNode;
}

const FormSection = ({ title, children }: FormSectionProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-white/90 mb-4 border-b border-white/20 pb-2">
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children}
      </div>
    </div>
  );
};

export default FormSection;
