
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
  const [extractedPdfText, setExtractedPdfText] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'upload' | 'text'>('upload');

  const validateForm = (tabType: 'upload' | 'text') => {
    const newErrors: Record<string, string> = {};
    let isValid = true;
    
    if (tabType === 'upload') {
      if (!pdfFile) {
        newErrors.file = 'Please upload a PDF file';
        isValid = false;
      } else if (!extractedPdfText) {
        // We have a file but no extracted text
        toast.warning('No text could be extracted from the PDF. The submission may not be as useful.');
        // Continue anyway since we have a file
      }
    }
    
    if (tabType === 'text' && !textContent.trim()) {
      newErrors.text = 'Please enter some text content';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleFileChange = (file: File | null, extractedText?: string) => {
    setPdfFile(file);
    if (extractedText) {
      setExtractedPdfText(extractedText);
    } else if (!file) {
      setExtractedPdfText('');
    }
  };

  const handleSubmit = (e: React.FormEvent, tabType: 'upload' | 'text') => {
    e.preventDefault();
    
    if (!validateForm(tabType)) {
      toast.error(`Please ${tabType === 'upload' ? 'upload a PDF file' : 'enter some text content'}`);
      return;
    }
    
    if (tabType === 'text') {
      const contentWithNotes = additionalNotes.trim() 
        ? `${textContent}\n\nADDITIONAL NOTES:\n${additionalNotes}`
        : textContent;
      onSubmit(contentWithNotes, 'text');
    } else {
      // For upload type, use the extracted text if available
      if (extractedPdfText) {
        const contentWithNotes = additionalNotes.trim() 
          ? `${extractedPdfText}\n\nADDITIONAL NOTES:\n${additionalNotes}`
          : extractedPdfText;
        onSubmit(contentWithNotes, 'text'); // Send as text type since we have the content
      } else {
        // Fall back to just sending the file name if no text was extracted
        const fileNameWithNotes = additionalNotes.trim()
          ? `${pdfFile?.name || 'Uploaded PDF'}\n\nADDITIONAL NOTES:\n${additionalNotes}`
          : pdfFile?.name || 'Uploaded PDF';
        onSubmit(fileNameWithNotes, 'upload');
      }
    }
  };

  return (
    <div className="glass-morphism rounded-2xl p-6 sm:p-8 shadow-lg">
      <Tabs 
        defaultValue="upload" 
        className="w-full"
        onValueChange={(value) => setActiveTab(value as 'upload' | 'text')}
      >
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
                onFileChange={handleFileChange}
                error={errors.file}
              />
            </FormField>
            
            {extractedPdfText && (
              <FormField
                label="Extracted PDF Text (Editable)"
                htmlFor="extractedText"
                className="mt-6"
              >
                <FormTextarea
                  id="extractedText"
                  value={extractedPdfText}
                  onChange={(e) => setExtractedPdfText(e.target.value)}
                  placeholder="Extracted text from PDF..."
                  rows={6}
                />
              </FormField>
            )}
            
            <FormField
              label="Additional Notes"
              htmlFor="additionalNotes"
              className="mt-6"
            >
              <FormTextarea
                id="additionalNotes"
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="Add any additional context or notes here..."
                rows={3}
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
            
            <FormField
              label="Additional Notes"
              htmlFor="additionalNotesText"
              className="mt-6"
            >
              <FormTextarea
                id="additionalNotesText"
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="Add any additional context or notes here..."
                rows={3}
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
