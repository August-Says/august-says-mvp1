
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface FileUploadProps {
  id: string;
  onFileChange: (file: File | null, content?: string) => void;
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
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setFileName(file.name);
      setIsLoading(true);
      
      try {
        if (file.type === 'application/pdf') {
          // Read file as ArrayBuffer
          const arrayBuffer = await file.arrayBuffer();
          
          // Convert ArrayBuffer to Uint8Array for pdf-parse
          const uint8Array = new Uint8Array(arrayBuffer);
          
          // Use a web worker to handle PDF parsing to avoid blocking the main thread
          const pdfWorker = new Worker(new URL('/src/workers/pdfWorker.js', import.meta.url));
          
          // Set up a timeout in case the worker doesn't respond
          const timeoutId = setTimeout(() => {
            pdfWorker.terminate();
            setIsLoading(false);
            toast.error('PDF processing timed out. Please try a different file.');
            onFileChange(file);
          }, 30000); // 30 second timeout
          
          pdfWorker.onmessage = (event) => {
            clearTimeout(timeoutId);
            const { content, error } = event.data;
            setIsLoading(false);
            
            if (error) {
              console.error('PDF parsing error:', error);
              toast.error('Could not extract text from PDF. Using file metadata only.');
              onFileChange(file);
            } else {
              console.log('PDF content extracted:', content.substring(0, 100) + '...');
              toast.success('PDF text extracted successfully');
              onFileChange(file, content);
            }
          };
          
          pdfWorker.onerror = (error) => {
            clearTimeout(timeoutId);
            console.error('Worker error:', error);
            setIsLoading(false);
            toast.error('Error processing PDF file. Using file metadata only.');
            onFileChange(file);
          };
          
          pdfWorker.postMessage({ pdfData: uint8Array });
        } else {
          setIsLoading(false);
          onFileChange(file);
        }
      } catch (error) {
        console.error('Error processing file:', error);
        setIsLoading(false);
        toast.error('Failed to process file. Using file metadata only.');
        onFileChange(file);
      }
    } else {
      setFileName("");
      setIsLoading(false);
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
        disabled={isLoading}
      />
      <div 
        className={cn(
          "bg-white/10 border border-dashed border-white/30 rounded-lg p-6 text-center cursor-pointer hover:bg-white/5 transition-colors",
          error ? "border-red-400" : "",
          isLoading ? "opacity-70" : "",
          className
        )}
      >
        <div className="flex flex-col items-center justify-center gap-2">
          {isLoading ? (
            <div className="animate-spin w-8 h-8 border-2 border-white/60 border-t-transparent rounded-full" />
          ) : (
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
          )}
          <div className="text-sm text-white/80">
            {fileName ? (
              <span>{fileName}{isLoading ? ' (Processing...)' : ''}</span>
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
