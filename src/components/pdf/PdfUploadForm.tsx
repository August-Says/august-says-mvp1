
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
  initialTextContent?: string;
}

const PdfUploadForm = ({ onSubmit, initialTextContent = '' }: PdfUploadFormProps) => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [textContent, setTextContent] = useState(initialTextContent);
  const [extractedText, setExtractedText] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'upload' | 'text'>('upload');

  const validateForm = (tab: 'upload' | 'text') => {
    const newErrors: Record<string, string> = {};
    let isValid = true;
    
    if (tab === 'upload' && !pdfFile) {
      newErrors.file = 'Please upload a PDF file';
      isValid = false;
    }
    
    if (tab === 'text' && !textContent.trim()) {
      newErrors.text = 'Please enter some text content';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent, tab: 'upload' | 'text') => {
    e.preventDefault();
    
    if (!validateForm(tab)) {
      toast.error(`Please ${tab === 'upload' ? 'upload a PDF file' : 'enter some text content'}`);
      return;
    }
    
    // If extractedText exists and we're in upload tab, use that instead
    if (tab === 'upload' && extractedText) {
      console.log('Submitting extracted text:', extractedText.substring(0, 100) + '...');
      onSubmit(extractedText, 'text');
    } else if (tab === 'text') {
      console.log('Submitting text content:', textContent.substring(0, 100) + '...');
      onSubmit(textContent, 'text');
    } else {
      // Fallback for upload without extraction
      console.log('Submitting file name (no extracted text)');
      onSubmit(`Content from PDF: ${pdfFile?.name || 'Uploaded PDF'}`, 'upload');
    }
  };

  const handleTextExtracted = (text: string) => {
    console.log('Text extracted, length:', text.length);
    setExtractedText(text);
    
    // Also update the text content field and switch to text tab
    setTextContent(text);
    setActiveTab('text');
    
    toast.success("Text successfully extracted from PDF");
  };

  return (
    <div className="glass-morphism rounded-2xl p-6 sm:p-8 shadow-lg">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'upload' | 'text')} className="w-full">
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
                onTextExtracted={handleTextExtracted}
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
