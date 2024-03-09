'use server';

import { openai } from '@/app/openai';
import { ChatMessage } from '@/components/chat/ChatMessage';
import {
  appendMessage,
  appendNewMessage,
  createNewMessage,
} from '@/usecases/chat.usecases';

import { createAI, getMutableAIState, render } from 'ai/rsc';
import { z } from 'zod';

async function submitUserMessage(userInput: string) {
  'use server';

  const aiState = getMutableAIState<typeof AIProvider>();

  // Update AI state with new message.
  aiState.update(
    appendNewMessage(aiState.get(), { role: 'user', content: userInput }),
  );

  // render() returns a stream of UI components
  const ui = render({
    model: 'gpt-3.5-turbo',
    provider: openai,
    messages: [
      {
        role: 'system',
        content:
          'Hi! I can give you information about who is who in The Iliad. Ask me anything!',
      },
      {
        role: 'user',
        content: userInput,
      },
    ],
    // `text` is called when an AI returns a text response (as opposed to a tool call)
    text: ({ content, done }: { content: string; done: boolean }) => {
      // text can be streamed from the LLM, but we only want to close the stream with .done() when its completed.
      // done() marks the state as available for the client to access
      const newMessage = createNewMessage({ role: 'assistant', content });
      if (done) {
        aiState.update(appendMessage(aiState.get(), newMessage));
      }

      return <ChatMessage message={newMessage} />;
    },
    tools: {
      get_character_info: {
        description: 'Get information about a character in The Iliad',
        parameters: z
          .object({
            name: z.string().describe('The name of the character'),
            side: z
              .enum(['Greek', 'Trojan'])
              .describe('The side of the character'),
            origin: z.string().describe('The city of origin of the character'),
            father: z.string().describe('The father of the character'),
            survives: z
              .boolean()
              .describe(
                'Whether the character survives until the end of the poem',
              ),
          })
          .required(),
        render: async function* ({
          name,
          side,
          origin,
          father,
          survives,
        }: {
          name: string;
          side: 'Greek' | 'Trojan';
          origin: string;
          father: string;
          survives: boolean;
        }) {
          yield (
            <div className="p-2 bg-gray-500 rounded-md w-48 h-16">
              <p>Loading...</p>
            </div>
          );

          aiState.done(
            appendNewMessage(aiState.get(), {
              role: 'assistant',
              content: JSON.stringify({ name, side, origin, father, survives }),
              name: 'get_character_info',
            }),
          );

          return (
            <div className="p-2 bg-gray-900 space-y-2 rounded-md">
              <h5 className="text-white text-lg">{name}</h5>
              <div>
                <p className="text-white">Side: {side}</p>
                <p className="text-white">Origin: {origin}</p>
                <p className="text-white">Father: {father}</p>
                <p className="text-white">
                  Survives: {survives ? 'Yes' : 'No'}
                </p>
              </div>
            </div>
          );
        },
      },
    },
  });

  return {
    id: Date.now(),
    display: ui,
  };
}

// Define the initial state of the AI. It can be any JSON object.
const initialAIState: {
  role: 'user' | 'assistant' | 'system' | 'function';
  content: string;
  id: string;
  name?: string;
}[] = [];

// The initial UI state that the client will keep track of.
const initialUIState: {
  id: number;
  display: React.ReactNode;
}[] = [];

// AI is a provider you wrap your application with so you can access AI and UI state in your components.
export const AIProvider = createAI({
  actions: {
    submitUserMessage,
  },
  // Each state can be any shape of object, but for chat applications
  // it makes sense to have an array of messages. Or you may prefer something like { id: number, messages: Message[] }
  initialUIState,
  initialAIState,
});
