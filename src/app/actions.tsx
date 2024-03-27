'use server';

import { openai } from '@/app/openai';
import { AIProviderType } from '@/app/state.types';
import CharacterCard from '@/components/characters/card/CharacterCard';
import { ChatMessage } from '@/components/chat/ChatMessage';
import ZTranslator from '@/components/visual-effects/ZTranslator';
import { Character } from '@/domain/core/Character';
import {
  appendMessage,
  appendNewMessage,
  createNewMessage,
} from '@/usecases/chat.usecases';

import { getMutableAIState, render } from 'ai/rsc';
import { z } from 'zod';

export async function submitUserMessage(userInput: string) {
  'use server';

  const aiState = getMutableAIState<AIProviderType>();

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
        description:
          'Get information about a character in The Iliad. The response should use the same language as the input, which can be either English or Spanish.',
        parameters: z
          .object({
            language: z
              .enum(['en', 'es'])
              .optional()
              .describe('The language of the input'),
            name: z.string().describe('The name of the character'),
            originalGreekName: z
              .string()
              .optional()
              .describe('The original Greek name of the character'),
            mortality: z
              .enum(['Mortal', 'God', 'Titan'])
              .optional()
              .describe('The mortality of the character'),
            side: z
              .enum(['Greek', 'Trojan', 'None'])
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
        render: async function* (
          props: Character & {
            language: 'en' | 'es';
          },
        ) {
          yield (
            <div className="p-2 bg-gray-500 rounded-md w-48 h-16">
              <p>Loading...</p>
            </div>
          );

          aiState.done(
            appendNewMessage(aiState.get(), {
              role: 'assistant',
              content: JSON.stringify(props),
              name: 'get_character_info',
            }),
          );

          try {
            //Use openai to call dall-e
            const imageResponse = await openai.images.generate({
              prompt: `A realistic and violent illustration of ${props.name}, whose father was ${props.father}, from The Iliad in a fight scene during the Trojan War, preferably in an actual scene from the Homeric poem.`,
              model: 'dall-e-2',
              n: 1,
              response_format: 'url',
              size: '256x256',
            });

            if (!imageResponse.data?.[0].url) {
              return (
                <div className="p-2 bg-red-500 rounded-md w-48 h-16">
                  <p>An error happened retrieving the image</p>
                </div>
              );
            }

            return (
              <ZTranslator>
                <CharacterCard
                  character={props}
                  imageSrc={imageResponse.data[0].url}
                  className="w-full md:w-1/2"
                />
              </ZTranslator>
            );
          } catch (error) {
            console.error(error);
            return (
              <div className="p-2 bg-red-500 rounded-md w-48 h-16">
                <p>Error</p>
              </div>
            );
          }
        },
      },
    },
  });

  return {
    id: Date.now(),
    display: ui,
  };
}
