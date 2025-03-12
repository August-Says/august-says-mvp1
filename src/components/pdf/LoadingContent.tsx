
import LinearProgressBar from '@/components/LinearProgressBar';

interface LoadingContentProps {
  loadingProgress?: number; // Keep for backward compatibility but we don't use it
}

const LoadingContent = ({ loadingProgress }: LoadingContentProps) => {
  return (
    <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="w-full max-w-md mx-auto glass-morphism rounded-xl p-8">
        <LinearProgressBar isLoading={true} />
      </div>
    </div>
  );
};

export default LoadingContent;
