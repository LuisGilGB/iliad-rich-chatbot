import { submitUserMessage } from '@/app/actions';
import { AIProviderType, AIState, UIState } from '@/app/state.types';
import { createAI } from 'ai/rsc';

// Define the initial state of the AI. It can be any JSON object.
const initialAIState: AIState = [];

// The initial UI state that the client will keep track of.
const initialUIState: UIState = [];

// AI is a provider you wrap your application with so you can access AI and UI state in your components.
export const AIProvider: AIProviderType = createAI({
  actions: {
    submitUserMessage,
  },
  // Each state can be any shape of object, but for chat applications
  // it makes sense to have an array of messages. Or you may prefer something like { id: number, messages: Message[] }
  initialUIState,
  initialAIState,
});

export default AIProvider;
