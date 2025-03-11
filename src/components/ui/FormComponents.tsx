
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { 
  RadioGroup,
  RadioGroupItem 
} from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  className?: string;
}

export const FormField: React.FC<FormFieldProps & React.PropsWithChildren> = ({ 
  label, 
  htmlFor, 
  error, 
  children,
  className 
}) => {
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

interface FormSelectProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
  placeholder?: string;
  error?: string;
  className?: string;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  id,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  error,
  className
}) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger 
        id={id} 
        className={cn(
          "bg-white/10 border-white/20 text-white focus:ring-cloudai-purple", 
          error ? "border-red-400" : "",
          className
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-cloudai-darkpurple/90 border-white/20 text-white backdrop-blur-md">
        {options.map((option) => (
          <SelectItem 
            key={option.value} 
            value={option.value}
            className="text-white focus:bg-white/10 focus:text-white"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

interface FormInputProps {
  id: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  className?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  className
}) => {
  return (
    <Input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={cn(
        "bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-cloudai-purple",
        error ? "border-red-400" : "",
        className
      )}
    />
  );
};

interface FormTextareaProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  error?: string;
  className?: string;
  rows?: number;
}

export const FormTextarea: React.FC<FormTextareaProps> = ({
  id,
  value,
  onChange,
  placeholder,
  error,
  className,
  rows = 5
}) => {
  return (
    <Textarea
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={cn(
        "bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-cloudai-purple",
        error ? "border-red-400" : "",
        className
      )}
      rows={rows}
    />
  );
};

interface FormRadioGroupProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
  error?: string;
  className?: string;
}

export const FormRadioGroup: React.FC<FormRadioGroupProps> = ({
  id,
  value,
  onChange,
  options,
  error,
  className
}) => {
  return (
    <RadioGroup 
      value={value} 
      onValueChange={onChange}
      className={cn("space-y-2", className)}
    >
      {options.map((option) => (
        <div key={option.value} className="flex items-center space-x-2">
          <RadioGroupItem 
            id={`${id}-${option.value}`} 
            value={option.value} 
            className="border-white/40 text-white bg-white/10 focus:ring-cloudai-purple"
          />
          <Label 
            htmlFor={`${id}-${option.value}`}
            className="text-white/80 font-normal"
          >
            {option.label}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};

interface FileUploadProps {
  id: string;
  onFileChange: (file: File | null) => void;
  accept?: string;
  error?: string;
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  id,
  onFileChange,
  accept = ".pdf",
  error,
  className
}) => {
  const [fileName, setFileName] = useState<string>("");
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setFileName(file.name);
      onFileChange(file);
    } else {
      setFileName("");
      onFileChange(null);
    }
  };
  
  return (
    <div className={cn("relative", className)}>
      <input
        id={id}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full"
      />
      <div 
        className={cn(
          "bg-white/10 border border-dashed border-white/30 rounded-lg p-6 text-center cursor-pointer hover:bg-white/5 transition-colors",
          error ? "border-red-400" : "",
          className
        )}
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <svg 
            className="w-8 h-8 text-white/60" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <div className="text-sm text-white/80">
            {fileName ? (
              <span>{fileName}</span>
            ) : (
              <>
                <span className="font-medium">Click to upload</span> or drag and drop
              </>
            )}
          </div>
          <p className="text-xs text-white/60">PDF (MAX. 10MB)</p>
        </div>
      </div>
    </div>
  );
};
