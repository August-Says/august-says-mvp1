
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  FormField, 
  FormTextarea,
  FileUpload
} from '@/components/ui/FormComponents';
import LoadingAnimation from '@/components/LoadingAnimation';
import ResultDisplay from '@/components/ResultDisplay';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PdfUpload = () => {
  const navigate = useNavigate();
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [textContent, setTextContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (activeTab: string) => {
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
  
  const handleSubmit = async (e: React.FormEvent, activeTab: string) => {
    e.preventDefault();
    
    if (!validateForm(activeTab)) {
      toast.error(`Please ${activeTab === 'upload' ? 'upload a PDF file' : 'enter some text content'}`);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mocked response for demonstration
      setResult(`# Generated Marketing Canvas

## Executive Summary
A comprehensive marketing strategy based on the ${activeTab === 'upload' ? 'uploaded PDF document' : 'provided text content'}. This canvas outlines key objectives, target audience insights, and actionable recommendations.

## Strategic Objectives
1. Increase brand awareness among target demographics
2. Improve customer engagement metrics across channels
3. Drive conversion rates through optimized customer journeys
4. Strengthen brand positioning against competitors

## Target Audience Analysis
Detailed breakdown of primary and secondary audience segments with behavioral patterns, preferences, and pain points identified through data analysis.

## Key Messages
- Primary message: Focus on value proposition and unique selling points
- Secondary messages: Address specific audience needs and objections
- Tone and voice recommendations for consistent communication

## Channel Strategy
Multi-channel approach with specific focus on:
- Digital (social media, content marketing, email)
- Traditional media placement
- Direct marketing initiatives
- Sales enablement

## Implementation Timeline
- Phase 1 (Weeks 1-4): Planning and asset development
- Phase 2 (Weeks 5-8): Initial launch and channel activation
- Phase 3 (Weeks 9-12): Optimization based on early performance data
- Phase 4 (Weeks 13-16): Scale successful tactics and refine approach

## Budget Allocation
Recommended budget distribution across channels and initiatives with flexibility for optimization during campaign execution.

## Success Metrics
- Brand awareness metrics
- Engagement rates
- Conversion metrics
- ROI calculations
- Customer satisfaction scores

## Risk Assessment
Potential challenges and mitigation strategies to ensure campaign resilience and adaptability.`);
      
      toast.success('Canvas generated successfully!');
    } catch (error) {
      toast.error('Failed to generate canvas. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleBack = () => {
    if (result) {
      setResult('');
    } else {
      navigate('/');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
        <LoadingAnimation message="Analyzing your document and generating canvas..." />
      </div>
    );
  }
  
  if (result) {
    return (
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
        <ResultDisplay result={result} onBack={handleBack} />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="mb-8">
        <Button 
          onClick={handleBack} 
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
      </div>
    </div>
  );
};

export default PdfUpload;
