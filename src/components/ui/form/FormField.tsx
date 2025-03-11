
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  className?: string;
  children: ReactNode;
}

export const FormField = ({ 
  label, 
  htmlFor, 
  error, 
  children,
  className 
}: FormFieldProps) => {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={htmlFor} className="text-white/90 font-medium">
        {label}
      </Label>
      {children}
      {error && <p className="text-sm text-red-400 mt-1">{error}</p>}
    </div>
  );
};
