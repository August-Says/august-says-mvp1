
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Download, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import html2pdf from 'html2pdf.js';

interface ResultDisplayProps {
  result: string;
  onBack: () => void;
}

const ResultDisplay = ({ result, onBack }: ResultDisplayProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = () => {
    if (!contentRef.current) {
      toast.error('Could not generate PDF. Please try again.');
      return;
    }
    
    toast.info('Preparing your PDF...');
    
    // Clone the content element to avoid styling issues
    const element = contentRef.current.cloneNode(true) as HTMLElement;
    
    // Apply PDF-specific styling to the cloned element
    element.style.width = '100%';
    element.style.padding = '20px';
    element.style.background = 'white';
    element.style.color = 'black';
    
    // Make sure all text is visible in the PDF
    const textElements = element.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, li');
    textElements.forEach(el => {
      (el as HTMLElement).style.color = 'black';
      (el as HTMLElement).style.opacity = '1';
    });
    
    // Apply styling to headings
    const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach(heading => {
      (heading as HTMLElement).style.color = '#333';
      (heading as HTMLElement).style.marginBottom = '10px';
    });
    
    const opt = {
      margin: [10, 10, 10, 10],
      filename: 'marketing-canvas.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        logging: false,
        backgroundColor: '#ffffff'
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true
      }
    };
    
    // Small delay to allow toast to show
    setTimeout(() => {
      html2pdf().from(element).set(opt).save()
        .then(() => {
          toast.success('PDF downloaded successfully!');
        })
        .catch((error) => {
          console.error('PDF generation error:', error);
          toast.error('Failed to generate PDF. Please try again.');
        });
    }, 300);
  };

  const handleShare = () => {
    toast.success('Share functionality will be available soon!');
  };

  const processContent = (content: string) => {
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return parsed.flatMap(item => {
          const output = item.output || item.canvas || '';
          if (!output) return [];
          return splitIntoSections(output);
        }).filter(section => section && section.content.trim());
      } else if (typeof parsed === 'object' && (parsed.output || parsed.canvas)) {
        const output = parsed.output || parsed.canvas;
        return splitIntoSections(output);
      }
    } catch (e) {
      return splitIntoSections(content);
    }
    return [];
  };

  const splitIntoSections = (content: string) => {
    const sectionPattern = /(?:###\s*|##\s*|\*\*)(SUMMARY|OBJECTIVE|THE OUTCOME|STRATEGIC IMPLICATIONS|WHAT IS A CANVASS|RECOMMENDED CANVASS FORMAT)(?:\s*:|\*\*\s*:|\*\*)/gi;
    
    const matches = [...content.matchAll(new RegExp(sectionPattern, 'gi'))];
    
    const sections = [];
    
    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      const startPos = match.index!;
      const endPos = i < matches.length - 1 ? matches[i + 1].index! : content.length;
      
      const titleMatch = match[0];
      const titleContent = match[1];
      const cleanTitle = titleContent.trim();
      
      const sectionContent = content.substring(startPos + titleMatch.length, endPos).trim();
      
      if (sectionContent) {
        sections.push({
          title: cleanTitle,
          content: sectionContent
        });
      }
    }
    
    return sections;
  };

  const formatSectionTitle = (title: string): string => {
    title = title.toUpperCase();
    
    switch (title) {
      case 'SUMMARY':
        return 'Summary';
      case 'OBJECTIVE':
        return 'Objective';
      case 'THE OUTCOME':
        return 'The Outcome';
      case 'STRATEGIC IMPLICATIONS':
        return 'Strategic Implications';
      case 'WHAT IS A CANVASS':
        return 'What is a Canvass';
      case 'RECOMMENDED CANVASS FORMAT':
        return 'Recommended Canvass Format';
      default:
        return title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();
    }
  };

  const processedSections = processContent(result);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-4xl mx-auto glass-morphism rounded-2xl p-8 md:p-10 my-8 shadow-lg overflow-y-auto"
    >
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-0">Your Marketing Canvas</h2>
        <div className="flex space-x-4">
          <Button 
            onClick={handleExportPDF} 
            className="bg-white text-august-purple hover:bg-white/90"
          >
            <Download size={18} className="mr-2" />
            Export PDF
          </Button>
          <Button 
            onClick={handleShare} 
            variant="outline" 
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Share2 size={18} className="mr-2" />
            Share
          </Button>
        </div>
      </div>
      
      <div ref={contentRef} className="space-y-8 text-white/90 pdf-content">
        {processedSections.length > 0 ? (
          processedSections.map((section, index) => {
            const title = formatSectionTitle(section.title);
            const content = section.content.trim();
            
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="border-b border-white/10 pb-6 last:border-0"
              >
                <h3 className="text-xl font-bold text-white mb-3 tracking-wide">{title}</h3>
                <div className="text-white/80 prose prose-sm prose-invert max-w-none">
                  {renderMarkdownContent(content)}
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-10">
            <p className="text-white/80">Your marketing canvas will appear here.</p>
          </div>
        )}
      </div>
      
      <div className="mt-8 pt-4 border-t border-white/10 flex justify-center">
        <Button
          onClick={onBack}
          variant="outline"
          className="bg-cloudai-purple text-white hover:bg-cloudai-violetpurple border-transparent font-medium shadow-md"
        >
          Generate New Canvas
        </Button>
      </div>
    </motion.div>
  );
};

const renderMarkdownContent = (content: string) => {
  const lines = content.split('\n');
  
  return (
    <div>
      {lines.map((line, lineIndex) => {
        if (line.trim().startsWith('-') || line.trim().startsWith('*')) {
          return (
            <div key={lineIndex} className="flex items-start space-x-2 my-1">
              <span className="text-cloudai-purple">•</span>
              <p>{line.trim().substring(1).trim()}</p>
            </div>
          );
        }
        
        const numberedMatch = line.trim().match(/^(\d+)\.\s(.+)$/);
        if (numberedMatch) {
          return (
            <div key={lineIndex} className="flex items-start space-x-2 my-1">
              <span className="text-cloudai-purple min-w-[20px]">{numberedMatch[1]}.</span>
              <p>{numberedMatch[2]}</p>
            </div>
          );
        }
        
        if (line.trim() === '') {
          return <div key={lineIndex} className="h-4"></div>;
        }
        
        return <p key={lineIndex} className="my-1">{line}</p>;
      })}
    </div>
  );
};

export default ResultDisplay;
