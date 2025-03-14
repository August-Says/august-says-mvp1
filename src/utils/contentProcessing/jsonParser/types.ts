
import type { Section } from '../types';

export interface InsightItem {
  category: string;
  description: string;
}

export interface QuestionItem {
  question: string;
  options: string[];
}

export interface ActivationAddon {
  strategy: string;
  details?: string;
  copy_example?: string;
}

export interface OutputStructure {
  summary?: string;
  objective?: string;
  outcome?: {
    insights?: InsightItem[];
    strategic_implications?: string[];
  };
  canvass?: {
    definition?: string;
    recommended_format?: string;
    questions?: QuestionItem[];
  };
  activation_add_ons?: ActivationAddon[];
}

export type WebhookResponse = {
  output: string | OutputStructure;
}[];

// Use export type when re-exporting a type with isolatedModules enabled
export type { Section };
