
import { useState } from 'react';
import { SubmissionHistory } from '@/types/webhook';

export const useSubmissionHistory = () => {
  const [submissionHistory, setSubmissionHistory] = useState<SubmissionHistory[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);

  const addToHistory = (entry: SubmissionHistory) => {
    setSubmissionHistory(prev => [...prev, entry]);
    setCurrentHistoryIndex(prev => prev + 1);
    return entry;
  };

  const navigateHistory = (direction: 'back' | 'forward') => {
    const newIndex = direction === 'back' ? currentHistoryIndex - 1 : currentHistoryIndex + 1;
    if (newIndex >= 0 && newIndex < submissionHistory.length) {
      setCurrentHistoryIndex(newIndex);
      return submissionHistory[newIndex];
    }
    return null;
  };

  return {
    submissionHistory,
    currentHistoryIndex,
    addToHistory,
    navigateHistory,
    hasHistory: submissionHistory.length > 0,
    canGoBack: currentHistoryIndex > 0,
    canGoForward: currentHistoryIndex < submissionHistory.length - 1,
    currentHistoryEntry: submissionHistory[currentHistoryIndex]
  };
};
