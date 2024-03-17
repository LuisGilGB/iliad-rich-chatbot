import { ExternalLink } from '@/components/external-link';

import { Button } from '@/components/ui/button';
import { IconArrowRight } from '@/components/ui/icons';
import { UseChatHelpers } from 'ai/react';

const exampleMessages = [
  {
    heading: 'Achilles',
    message: 'Tell me about Achilles',
  },
  {
    heading: 'Agamemnon',
    message: 'Tell me about Agamemnon',
  },
  {
    heading: 'Hector',
    message: `Tell me about Hector`,
  },
];

export function ChatEmptyScreen({
  setInput,
}: Pick<UseChatHelpers, 'setInput'>) {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8">
        <h1 className="mb-2 text-lg font-semibold">
          Welcome to Iliad Rich Chatbot!
        </h1>
        <p className="mb-2 leading-normal text-muted-foreground">
          This is an AI chatbot app that provides information about characters
          of The Iliad not just through test; but with rich UI elements thanks
          to Generative UI from
          <ExternalLink href="https://sdk.vercel.ai/docs">
            Vercel&apos;s AI SDK v3
          </ExternalLink>
          .
        </p>
        <p className="leading-normal text-muted-foreground">
          You can start a conversation here or ask information about the
          following characters by just clicking on them:
        </p>
        <div className="mt-4 flex flex-col items-start space-y-2">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base"
              onClick={() => setInput(message.message)}
            >
              <IconArrowRight className="mr-2 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
