
import React from 'react';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface ShareButtonProps {
  contentRef?: React.RefObject<HTMLDivElement>;
}

const ShareButton = ({ contentRef }: ShareButtonProps) => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        // Get the title from the document or fall back to a default
        const title = document.title || 'Marketing Canvas';
        
        // Get text content from the contentRef if available
        let text = 'Check out this marketing canvas I created!';
        if (contentRef?.current) {
          const textContent = contentRef.current.textContent || '';
          // Limit the text to a reasonable size
          text = textContent.substring(0, 100) + (textContent.length > 100 ? '...' : '');
        }
        
        await navigator.share({
          title,
          text,
          url: window.location.href,
        });
        
        toast.success('Canvas shared successfully!');
      } catch (error) {
        console.error('Error sharing:', error);
        if ((error as Error).name !== 'AbortError') {
          toast.error('Unable to share. Try a different method.');
        }
      }
    } else {
      // Fallback to clipboard copying when Web Share API is not available
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      } catch (error) {
        console.error('Failed to copy:', error);
        toast.error('Could not copy link. Please copy it manually.');
      }
    }
  };

  return (
    <Button 
      onClick={handleShare} 
      className="bg-white text-august-purple hover:bg-white/90"
    >
      <Share2 size={18} className="mr-2" />
      Share
    </Button>
  );
};

export default ShareButton;
