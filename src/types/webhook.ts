
export interface WebhookOptions {
  fallbackGenerator?: (content: string) => string;
  webhookUrl?: string;
}

export interface SubmissionHistory {
  result: string;
  params: Record<string, string>;
  contentValue?: string;
}

export interface WebhookSubmissionResult {
  isLoading: boolean;
  result: string;
  setResult: React.Dispatch<React.SetStateAction<string>>;
  callWebhook: (
    params: Record<string, string>,
    contentKey?: string,
    contentValue?: string
  ) => Promise<any>;
  navigateHistory: (direction: 'back' | 'forward') => SubmissionHistory | null;
  hasHistory: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
  currentHistoryEntry: SubmissionHistory | undefined;
  lastRawResponse: string;
}
