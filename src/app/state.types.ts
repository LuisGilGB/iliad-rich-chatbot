import { createAI } from 'ai/rsc';
import * as React from 'react';

export type AIState = {
  role: 'user' | 'assistant' | 'system' | 'function';
  content: string;
  id: string;
  name?: string;
}[];

export type UISTateItem = {
  id: number;
  display: React.ReactNode;
};

export type UIState = UISTateItem[];

export type AIProviderType = ReturnType<
  typeof createAI<
    AIState,
    UIState,
    {
      submitUserMessage: (userInput: string) => Promise<UISTateItem>;
    }
  >
>;
