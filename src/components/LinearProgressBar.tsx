
import React from 'react';

interface LinearProgressBarProps {
  isLoading: boolean;
}

const LinearProgressBar = ({ isLoading }: LinearProgressBarProps) => {
  if (!isLoading) return null;

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
      </div>
      
      <p className="text-white/90 text-lg font-medium text-center mt-4 mb-6">
        Analyzing your document and generating canvas...
      </p>
      
      <div className="text-white/80 text-sm font-medium">
        <div>Please wait while we process your request</div>
      </div>
    </div>
  );
};

export default LinearProgressBar;
