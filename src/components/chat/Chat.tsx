'use client';

import { AIProvider } from '@/app/actions';
import { ChatList } from '@/components/chat/ChatList';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { ChatScrollAnchor } from '@/components/chat/ChatScrollAnchor';
import { EmptyScreen } from '@/components/empty-screen';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useLocalStorage } from '@/lib/hooks/use-local-storage';

import { cn } from '@/lib/utils';
import { type Message, useChat } from 'ai/react';
import { useActions, useUIState } from 'ai/rsc';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const IS_PREVIEW = process.env.VERCEL_ENV === 'preview';
export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[];
  id?: string;
}

export function Chat({ id, initialMessages, className }: ChatProps) {
  const router = useRouter();
  const path = usePathname();
  const [previewToken, setPreviewToken] = useLocalStorage<string | null>(
    'ai-token',
    null,
  );
  const { submitUserMessage } = useActions<typeof AIProvider>();

  const [previewTokenDialog, setPreviewTokenDialog] = useState(IS_PREVIEW);
  const [previewTokenInput, setPreviewTokenInput] = useState(
    previewToken ?? '',
  );

  const { reload, stop, isLoading, input, setInput } = useChat({
    initialMessages,
    id,
    body: {
      id,
      previewToken,
    },
    onResponse(response) {
      if (response.status === 401) {
        toast.error(response.statusText);
      }
    },
    onFinish() {
      if (!path.includes('chat')) {
        window.history.pushState({}, '', `/chat/${id}`);
      }
    },
  });

  const [rawMessages, setRawMessages] = useUIState<typeof AIProvider>();
  const messages = rawMessages.map(message => ({
    ...message,
    id: message.id.toString(),
    content: 'Content', // DELETE ME
    role: 'user' as 'user',
  }));

  const onSubmit = useCallback(
    async (message: string) => {
      const responseMessage = await submitUserMessage(message);
      setRawMessages(currentMessages => [...currentMessages, responseMessage]);
    },
    [setRawMessages, submitUserMessage],
  );

  return (
    <>
      <div className={cn('pb-[200px] pt-4 md:pt-10', className)}>
        {messages.length ? (
          <>
            <ChatList messages={messages} />
            <ChatScrollAnchor trackVisibility={isLoading} />
          </>
        ) : (
          <EmptyScreen setInput={setInput} />
        )}
      </div>
      <ChatPanel
        id={id}
        isLoading={isLoading}
        stop={stop}
        reload={reload}
        messages={messages}
        input={input}
        setInput={setInput}
        onSubmit={onSubmit}
      />

      <Dialog open={previewTokenDialog} onOpenChange={setPreviewTokenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter your OpenAI Key</DialogTitle>
            <DialogDescription>
              If you have not obtained your OpenAI API key, you can do so by{' '}
              <a
                href="https://platform.openai.com/signup/"
                className="underline"
              >
                signing up
              </a>{' '}
              on the OpenAI website. This is only necessary for preview
              environments so that the open source community can test the app.
              The token will be saved to your browser&apos;s local storage under
              the name <code className="font-mono">ai-token</code>.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={previewTokenInput}
            placeholder="OpenAI API key"
            onChange={e => setPreviewTokenInput(e.target.value)}
          />
          <DialogFooter className="items-center">
            <Button
              onClick={() => {
                setPreviewToken(previewTokenInput);
                setPreviewTokenDialog(false);
              }}
            >
              Save Token
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
