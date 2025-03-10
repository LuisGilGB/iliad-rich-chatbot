'use client';

import { AIProviderType } from '@/app/state.types';
import ChatEmptyScreen from '@/components/chat/ChatEmptyScreen';
import { ChatList } from '@/components/chat/ChatList';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ChatPanel } from '@/components/chat/ChatPanel';

import { cn } from '@/lib/utils';
import { createNewMessage } from '@/usecases/chat.usecases';
import { type Message, useChat } from 'ai/react';
import { useActions, useUIState } from 'ai/rsc';
import { usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { ChatScrollAnchor } from './ChatScrollAnchor';

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[];
  id?: string;
}

export function Chat({ id, initialMessages, className }: ChatProps) {
  const path = usePathname();
  const { submitUserMessage, reloadAssistantResponse } =
    useActions<AIProviderType>();

  const { stop, isLoading, input, setInput } = useChat({
    initialMessages,
    id,
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
          <ChatEmptyScreen onSuggestionClick={onSubmit} />
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
    </>
  );
}
