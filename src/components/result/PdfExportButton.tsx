
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import html2pdf from 'html2pdf.js';

interface PdfExportButtonProps {
  contentRef: React.RefObject<HTMLDivElement>;
}

const PdfExportButton = ({ contentRef }: PdfExportButtonProps) => {
  const handleExportPDF = () => {
    if (!contentRef.current) {
      toast.error('Could not generate PDF. Please try again.');
      return;
    }
    
    toast.info('Preparing your PDF...');
    
    // Clone the content element to avoid styling issues
    const element = contentRef.current.cloneNode(true) as HTMLElement;
    
    // Create a container for the PDF content
    const container = document.createElement('div');
    container.style.padding = '20px';
    container.style.background = 'white';
    
    // Add company logo to the top of the PDF
    const logoContainer = document.createElement('div');
    logoContainer.style.textAlign = 'center';
    logoContainer.style.marginBottom = '20px';
    
    // Create logo image
    const logoImg = document.createElement('img');
    logoImg.src = '/lovable-uploads/88f0766a-a7d4-4c0a-a3f7-64fe15baa48e.png'; // Agency of Impact logo
    logoImg.style.maxHeight = '80px';
    logoImg.alt = 'Agency of Impact Logo';
    
    // Append logo and content to container
    logoContainer.appendChild(logoImg);
    container.appendChild(logoContainer);
    container.appendChild(element);
    
    // Apply PDF-specific styling to the content
    element.style.width = '100%';
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
      html2pdf().from(container).set(opt).save()
        .then(() => {
          toast.success('PDF downloaded successfully!');
        })
        .catch((error) => {
          console.error('PDF generation error:', error);
          toast.error('Failed to generate PDF. Please try again.');
        });
    }, 300);
  };

  return (
    <Button 
      onClick={handleExportPDF} 
      className="bg-white text-august-purple hover:bg-white/90"
    >
      <Download size={18} className="mr-2" />
      Export PDF
    </Button>
  );
};

export default PdfExportButton;
