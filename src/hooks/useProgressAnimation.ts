import { useState, useEffect } from 'react';

export const useProgressAnimation = (isLoading: boolean) => {
  // We're keeping this hook for compatibility, but now just returning a static value
  // since we're using the new LinearProgressBar component
  return 0; // Return 0 as we're not using this progress value anymore
};
