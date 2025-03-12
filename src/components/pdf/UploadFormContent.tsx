
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import PdfUploadForm from '@/components/pdf/PdfUploadForm';

interface UploadFormContentProps {
  onBack: () => void;
  onSubmit: (content: string, type: 'upload' | 'text') => void;
  textContent: string;
}

const UploadFormContent = ({ onBack, onSubmit, textContent }: UploadFormContentProps) => {
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="mb-8">
        <Button 
          onClick={onBack} 
          variant="ghost" 
          className="text-white/80 hover:text-white hover:bg-white/10"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Home
        </Button>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Create Canvas Using Document</h1>
          <p className="text-white/80">
            Upload a PDF or paste text to generate a customized marketing canvas.
          </p>
        </div>
        
        <PdfUploadForm onSubmit={onSubmit} initialTextContent={textContent} />
      </div>
    </div>
  );
};

export default UploadFormContent;
