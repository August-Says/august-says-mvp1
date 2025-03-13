import { useState, useEffect } from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { FormInput } from './FormInput';
import { cn } from '@/lib/utils';

interface FormSelectWithCustomOptionProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
  placeholder?: string;
  error?: string;
  className?: string;
  customOptionLabel?: string;
}

export const FormSelectWithCustomOption = ({
  id,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  error,
  className,
  customOptionLabel = "Other (specify)"
}: FormSelectWithCustomOptionProps) => {
  const [isCustomValue, setIsCustomValue] = useState(false);
  const [customValue, setCustomValue] = useState('');
  
  // Check if the current value exists in options
  useEffect(() => {
    const valueInOptions = options.some(option => option.value === value);
    if (!valueInOptions && value) {
      setIsCustomValue(true);
      setCustomValue(value);
    } else {
      setIsCustomValue(false);
    }
  }, [value, options]);

  const handleSelectChange = (selectedValue: string) => {
    if (selectedValue === 'custom') {
      setIsCustomValue(true);
      // If we already have a custom value, keep it, otherwise set to empty
      onChange(customValue || '');
    } else {
      setIsCustomValue(false);
      onChange(selectedValue);
    }
  };

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setCustomValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      <Select 
        value={isCustomValue ? 'custom' : value} 
        onValueChange={handleSelectChange}
      >
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
          <SelectItem 
            value="custom" 
            className="text-white focus:bg-white/10 focus:text-white border-t border-white/20 mt-1 pt-1"
          >
            {customOptionLabel}
          </SelectItem>
        </SelectContent>
      </Select>
      
      {isCustomValue && (
        <FormInput
          id={`${id}-custom`}
          value={customValue}
          onChange={handleCustomInputChange}
          placeholder="Type your custom value..."
          error={error}
          className="mt-2"
        />
      )}
    </div>
  );
};
