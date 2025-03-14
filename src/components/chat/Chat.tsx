'use client';

import { AIProviderType } from '@/app/state.types';
import { ChatEmptyScreen } from '@/components/chat/ChatEmptyScreen';
import { ChatList } from '@/components/chat/ChatList';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ChatPanel } from '@/components/chat/ChatPanel';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { useLocalStorage } from '@/lib/hooks/use-local-storage';

import { cn } from '@/lib/utils';
import { createNewMessage } from '@/usecases/chat.usecases';
import { type Message, useChat } from 'ai/react';
import { useActions, useUIState } from 'ai/rsc';
import { usePathname } from 'next/navigation';
import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ChatScrollAnchor } from './ChatScrollAnchor';

const IS_PREVIEW = process.env.VERCEL_ENV === 'preview';
export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[];
  id?: string;
}

export function Chat({ id, initialMessages, className }: ChatProps) {
  const path = usePathname();
  const [previewToken, setPreviewToken] = useLocalStorage<string | null>(
    'ai-token',
    null,
  );
  const { submitUserMessage, reloadAssistantResponse } =
    useActions<AIProviderType>();

  const [previewTokenDialog, setPreviewTokenDialog] = useState(IS_PREVIEW);
  const [previewTokenInput, setPreviewTokenInput] = useState(
    previewToken ?? '',
  );

  const { stop, isLoading, input, setInput } = useChat({
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

  const [messages, setMessages] = useUIState<AIProviderType>();

  const onSubmit = useCallback(
    async (message: string) => {
      const newMessage = createNewMessage({
        role: 'user',
        content: message,
      });
      setMessages(currentMessages => [
        ...currentMessages,
        {
          id: Date.now(),
          display: <ChatMessage message={{
            ...newMessage,
            role: 'user'
          }} />,
        },
      ]);
      const responseMessage = await submitUserMessage(message);
      setMessages(currentMessages => [...currentMessages, responseMessage]);
    },
    [setMessages, submitUserMessage],
  );

  const onReloadClick = useCallback(() => {
    reloadAssistantResponse();
  }, [reloadAssistantResponse]);

  return (
    <>
      <div className={cn('pb-[200px] pt-4 md:pt-10', className)}>
        {messages.length ? (
          <>
            <ChatList messages={messages} />
            <ChatScrollAnchor trackVisibility={isLoading} />
          </>
        ) : (
          <ChatEmptyScreen setInput={setInput} />
        )}
      </div>
      <ChatPanel
        id={id}
        isLoading={isLoading}
        stop={stop}
        messages={messages}
        input={input}
        setInput={setInput}
        onReloadClick={onReloadClick}
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
