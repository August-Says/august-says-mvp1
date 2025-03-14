
import { useState } from 'react';
import { cn } from '@/lib/utils';
import * as pdfjs from 'pdfjs-dist';
import { toast } from 'sonner';

// Import the worker directly instead of using CDN
import * as pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs';

// Set up the worker
if (typeof window !== 'undefined' && !pdfjs.GlobalWorkerOptions.workerPort) {
  pdfjs.GlobalWorkerOptions.workerPort = new Worker(
    new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url),
    { type: 'module' }
  );
}

interface FileUploadProps {
  id: string;
  onFileChange: (file: File | null, extractedText?: string) => void;
  accept?: string;
  error?: string;
  className?: string;
}

export const FileUpload = ({
  id,
  onFileChange,
  accept = ".pdf",
  error,
  className
}: FileUploadProps) => {
  const [fileName, setFileName] = useState<string>("");
  const [isExtracting, setIsExtracting] = useState(false);
  
  const extractTextFromPDF = async (file: File): Promise<string> => {
    setIsExtracting(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      let extractedText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        extractedText += pageText + '\n\n';
      }
      
      return extractedText;
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      toast.error('Failed to extract text from PDF');
      return '';
    } finally {
      setIsExtracting(false);
    }
  };
  
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setFileName(file.name);
      
      if (file.type === 'application/pdf') {
        toast.info('Extracting text from PDF...');
        const extractedText = await extractTextFromPDF(file);
        if (extractedText) {
          toast.success('PDF text extracted successfully');
          onFileChange(file, extractedText);
        } else {
          onFileChange(file);
        }
      } else {
        onFileChange(file);
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
        disabled={isExtracting}
      />
      <div 
        className={cn(
          "bg-white/10 border border-dashed border-white/30 rounded-lg p-6 text-center cursor-pointer hover:bg-white/5 transition-colors",
          error ? "border-red-400" : "",
          isExtracting ? "opacity-70" : "",
          className
        )}
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <svg 
            className={cn("w-8 h-8 text-white/60", isExtracting ? "animate-spin" : "")} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d={isExtracting ? "M12 6v6m0 0v6m0-6h6m-6 0H6" : "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"}
            />
          </svg>
          <div className="text-sm text-white/80">
            {isExtracting ? (
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
