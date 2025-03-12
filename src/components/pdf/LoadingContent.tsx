
import LinearProgressBar from '@/components/LinearProgressBar';

interface LoadingContentProps {
  loadingProgress?: number; // Keep for backward compatibility but we don't use it
}

const LoadingContent = ({ loadingProgress }: LoadingContentProps) => {
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <LinearProgressBar isLoading={true} />
    </div>
  );
};

export default LoadingContent;
