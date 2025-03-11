
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  FormField, 
  FormTextarea,
  FileUpload
} from '@/components/ui/FormComponents';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';

interface PdfUploadFormProps {
  onSubmit: (content: string, type: 'upload' | 'text') => void;
}

const PdfUploadForm = ({ onSubmit }: PdfUploadFormProps) => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [textContent, setTextContent] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (activeTab: 'upload' | 'text') => {
    const newErrors: Record<string, string> = {};
    let isValid = true;
    
    if (activeTab === 'upload' && !pdfFile) {
      newErrors.file = 'Please upload a PDF file';
      isValid = false;
    }
    
    if (activeTab === 'text' && !textContent.trim()) {
      newErrors.text = 'Please enter some text content';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent, activeTab: 'upload' | 'text') => {
    e.preventDefault();
    
    if (!validateForm(activeTab)) {
      toast.error(`Please ${activeTab === 'upload' ? 'upload a PDF file' : 'enter some text content'}`);
      return;
    }
    
    if (activeTab === 'text') {
      onSubmit(textContent, 'text');
    } else {
      // PDF file handling
      onSubmit(pdfFile?.name || 'Uploaded PDF', 'upload');
    }
  };

  return (
    <div className="glass-morphism rounded-2xl p-6 sm:p-8 shadow-lg">
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white/10 text-white">
          <TabsTrigger 
            value="upload" 
            className="data-[state=active]:bg-white/20 data-[state=active]:text-white"
          >
            Upload PDF
          </TabsTrigger>
          <TabsTrigger 
            value="text" 
            className="data-[state=active]:bg-white/20 data-[state=active]:text-white"
          >
            Paste Text
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="mt-6">
          <form onSubmit={(e) => handleSubmit(e, 'upload')}>
            <FormField 
              label="Upload PDF Document" 
              htmlFor="pdfFile" 
              error={errors.file}
            >
              <FileUpload
                id="pdfFile"
                onFileChange={setPdfFile}
                error={errors.file}
              />
            </FormField>
            
            <div className="mt-8 flex justify-center">
              <Button 
                type="submit" 
                className="bg-august-purple hover:bg-august-purple/90 text-white font-medium px-10"
                size="lg"
                disabled={!pdfFile}
              >
                Generate Canvas
              </Button>
            </div>
          </form>
        </TabsContent>
        
        <TabsContent value="text" className="mt-6">
          <form onSubmit={(e) => handleSubmit(e, 'text')}>
            <FormField 
              label="Paste Text Content" 
              htmlFor="textContent" 
              error={errors.text}
            >
              <FormTextarea
                id="textContent"
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Paste the document text here..."
                error={errors.text}
                rows={10}
              />
            </FormField>
            
            <div className="mt-8 flex justify-center">
              <Button 
                type="submit" 
                className="bg-august-purple hover:bg-august-purple/90 text-white font-medium px-10"
                size="lg"
                disabled={!textContent.trim()}
              >
                Generate Canvas
              </Button>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PdfUploadForm;
