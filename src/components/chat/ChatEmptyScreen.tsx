import { ExternalLink } from '@/components/ExternalLink';

import { Button } from '@/components/ui/button';

const exampleBlocks = [
  {
    heading: 'Achilles',
    message: 'Tell me, o muse, of the man who wandered far and wide...',
  },
  {
    heading: 'Agamemnon',
    message: 'Tell me about the man who led the Greeks to Troy',
  },
  {
    heading: 'Hector',
    message: `Who was the main hero of the Trojans?`,
  },
  {
    heading: 'Athena',
    message: `What was Athena's role in the Iliad?`,
  },
];

interface ChatEmptyScreenProps {
  onSuggestionClick: (message: string) => void;
}

const ChatEmptyScreen = ({
  onSuggestionClick,
}: ChatEmptyScreenProps) => {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8">
        <h1 className="mb-2 text-lg font-semibold">
          Welcome to Iliad Rich Chatbot!
        </h1>
        <p className="mb-2 leading-normal text-muted-foreground">
          This is an AI chatbot app that provides information about characters
          of The Iliad not just through text; but with rich UI elements thanks
          to React Server Components rendered and streamed using{' '}
          <ExternalLink href="https://sdk.vercel.ai/docs">
            Vercel&apos;s AI SDK v4
          </ExternalLink>
          .
        </p>
        <p className="leading-normal text-muted-foreground">
          You can start a conversation here or ask information about the
          following characters by just clicking on them:
        </p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {exampleBlocks.map((example) => (
            <Button
              key={example.heading}
              variant="outline"
              className="block h-auto p-2 space-y-1 text-center cursor-pointer"
              onClick={() => onSuggestionClick(example.message)}
            >
              <p className="text-base font-semibold">
                {example.heading}
              </p>
              <p className="text-muted-foreground italic text-xs">
                {example.message}
              </p>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ChatEmptyScreen;
