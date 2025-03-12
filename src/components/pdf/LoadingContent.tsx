
import LoadingAnimation from '@/components/LoadingAnimation';

interface LoadingContentProps {
  loadingProgress: number;
}

const LoadingContent = ({ loadingProgress }: LoadingContentProps) => {
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <LoadingAnimation 
        message="Analyzing your document and generating canvas..." 
        progress={loadingProgress}
      />
    </div>
  );
};

export default LoadingContent;
