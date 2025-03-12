
import LinearProgressBar from '@/components/LinearProgressBar';

interface LoadingContentProps {
  loadingProgress?: number; // Keep for backward compatibility but we don't use it
  message?: string;
}

const LoadingContent = ({ loadingProgress, message }: LoadingContentProps) => {
  return (
    <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="w-full max-w-md mx-auto glass-morphism rounded-xl p-8 shadow-lg shadow-blue-500/10">
        <LinearProgressBar isLoading={true} />
        {message && (
          <p className="text-center text-white/80 mt-4">{message}</p>
        )}
      </div>
    </div>
  );
};

export default LoadingContent;
