
import LoadingAnimation from '@/components/LoadingAnimation';

interface LoadingContentProps {
  loadingProgress?: number; // Keep for backward compatibility but we don't use it
}

const LoadingContent = ({ loadingProgress }: LoadingContentProps) => {
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="w-full max-w-4xl mx-auto glass-morphism rounded-xl p-8 shadow-lg shadow-blue-500/20">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-0">Your Marketing Canvas</h2>
        </div>
        
        <div className="py-4">
          <LoadingAnimation progress={75} />
        </div>
        
        <div className="mt-8 pt-4 border-t border-white/10 flex justify-between items-center">
          <div className="text-white/70">Preparing your marketing canvas masterpiece...</div>
        </div>
      </div>
    </div>
  );
};

export default LoadingContent;
