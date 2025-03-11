
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface FormSelectProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
  placeholder?: string;
  error?: string;
  className?: string;
}

export const FormSelect = ({
  id,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  error,
  className
}: FormSelectProps) => {
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
