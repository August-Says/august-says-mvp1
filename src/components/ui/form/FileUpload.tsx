
import { useState } from 'react';
import { cn } from '@/lib/utils';
import pdfParse from 'pdf-parse';

interface FileUploadProps {
  id: string;
  onFileChange: (file: File | null) => void;
  onTextExtracted?: (text: string) => void;
  accept?: string;
  error?: string;
  className?: string;
}

export const FileUpload = ({
  id,
  onFileChange,
  onTextExtracted,
  accept = ".pdf",
  error,
  className
}: FileUploadProps) => {
  const [fileName, setFileName] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      setFileName(file.name);
      onFileChange(file);
      
      // Extract text from PDF if it's a PDF file and we have a callback
      if (file.type === 'application/pdf' && onTextExtracted) {
        setIsProcessing(true);
        try {
          console.log('Starting PDF extraction');
          const arrayBuffer = await file.arrayBuffer();
          const buffer = new Uint8Array(arrayBuffer);
          console.log('Buffer created, calling pdfParse');
          const data = await pdfParse(buffer);
          console.log('PDF parsing complete, text length:', data.text.length);
          onTextExtracted(data.text);
        } catch (error) {
          console.error('Error parsing PDF:', error);
          // If extraction fails, at least provide the file name so the form can still submit
          if (onTextExtracted) {
            onTextExtracted(`Failed to extract text from ${file.name}. Error: ${error}`);
          }
        } finally {
          setIsProcessing(false);
        }
      }
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
            {isProcessing ? (
              <span>Extracting text...</span>
            ) : fileName ? (
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
