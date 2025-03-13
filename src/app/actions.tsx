'use server';

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
import { createStreamableUI, getMutableAIState, streamUI } from 'ai/rsc';
import { z } from 'zod';
import { openai4oModel, openaiDallE3Model } from './openai';

const StandardLoader = () => (
  <div className="p-2 bg-gray-500 rounded-md w-48 h-16">
    <p>Loading...</p>
  </div>
);

export const submitUserMessage = async (userInput: string) => {
  'use server';

  const aiState = getMutableAIState<AIProviderType>();

  // Update AI state with new message.
  aiState.update(
    appendNewMessage(aiState.get(), { role: 'user', content: userInput }),
  );

  const uiStream = streamUI({
    model: openai4oModel,
    initial: <StandardLoader />,
    system: 'Hi! I can give you information about who is who in The Iliad. Ask me anything!',
    messages: aiState.get().map(message => ({
      ...message,
      role: message.role as 'user' | 'assistant'
    })),
    // `text` is called when an AI returns a text response (as opposed to a tool call)
    text: ({ content, done }: { content: string; done: boolean }) => {
      // text can be streamed from the LLM, but we only want to close the stream with .done() when its completed.
      // done() marks the state as available for the client to access
      const newMessage = createNewMessage({ role: 'assistant', content });
      if (done) {
        aiState.update(appendMessage(aiState.get(), newMessage));
      }

      return <ChatMessage message={{
        ...newMessage,
        role: 'assistant' // Needed for typing issues
      }} />;
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
              .describe('Whether the character survives until the end of the poem'),
          })
          .required(),
        generate: async function* (
          props: Character & {
            language: 'en' | 'es';
          },
        ) {
          yield <StandardLoader />;

          aiState.done(
            appendNewMessage(aiState.get(), {
              role: 'assistant',
              content: JSON.stringify(props),
              name: 'get_character_info',
            }),
          );

          try {
            //Use openai to call dall-e
            const imageResponse = await openaiDallE3Model.doGenerate({
              prompt: `A realistic and violent illustration of ${props.name}, whose father was ${props.father}, from The Iliad in a fight scene during the Trojan War, preferably in an actual scene from the Homeric poem.`,
              n: 1,
              size: '1024x1792',
              seed: undefined,
              aspectRatio: undefined,
              providerOptions: {
                openai: {
                  response_format: 'url',
                },
              },
            });

            if (!imageResponse.images?.[0]) {
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
                  imageSrc={imageResponse.images[0].toString()}
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
    display: (await uiStream).value,
  };
};

export const reloadAssistantResponse = async () => {
  'use server';

  const aiState = getMutableAIState<AIProviderType>();

  const lastUserMessage = aiState
    .get()
    .findLast(message => message.role === 'user');

  if (!lastUserMessage) {
    return;
  }

  const lastAssistantMessage = aiState
    .get()
    .findLast(message => message.role === 'assistant');

  if (lastAssistantMessage) {
    aiState.update(
      appendMessage(
        aiState.get().filter(message => message.id !== lastAssistantMessage.id),
        {
          ...lastAssistantMessage,
          content: 'Regenerating response...',
        },
      ),
    );
  }

  const uiStream = createStreamableUI(<div>Regen...</div>);

  (async () => {
    try {
      uiStream.update(<div>Regen regen...</div>);
      await new Promise(resolve => setTimeout(resolve, 1000));
      uiStream.done(<div>Regenerated</div>);
    } catch (error) {
      console.error(error);
      uiStream.done(<div>Regen failed...</div>);
    }
  })();

  return {
    id: Date.now(),
    display: uiStream.value,
  };
};
