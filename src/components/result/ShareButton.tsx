
import React from 'react';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { toast } from 'sonner';

const ShareButton = () => {
  const handleShare = () => {
    toast.success('Share functionality will be available soon!');
  };

  return (
    <Button 
      onClick={handleShare} 
      variant="outline" 
      className="border-white/20 text-white hover:bg-white/10"
    >
      <Share2 size={18} className="mr-2" />
      Share
    </Button>
  );
};

export default ShareButton;
