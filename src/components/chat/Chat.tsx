'use client';

import { AIProviderType } from '@/app/state.types';
import ChatEmptyScreen from '@/components/chat/ChatEmptyScreen';
import { ChatList } from '@/components/chat/ChatList';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ChatPanel } from '@/components/chat/ChatPanel';

import { cn } from '@/lib/utils';
import { createNewMessage } from '@/usecases/chat.usecases';
import { useActions, useUIState } from 'ai/rsc';
import { useCallback } from 'react';
import { ChatScrollAnchor } from './ChatScrollAnchor';

export interface ChatProps extends React.ComponentProps<'div'> {
  id?: string;
}

export const Chat = ({ className }: ChatProps) => {
  const { submitUserMessage } = useActions<AIProviderType>();
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
          role: 'user',
          display: <ChatMessage message={{
            ...newMessage,
            role: 'user' // Typing issue
          }} />,
        },
      ]);
      const responseMessage = await submitUserMessage(message);
      setMessages(currentMessages => [...currentMessages, responseMessage]);
    },
    [setMessages, submitUserMessage],
  );


  return (
    <>
      <div className={cn('pb-[200px] pt-4 md:pt-10', className)}>
        {messages.length ? (
          <>
            <ChatList messages={messages} />
            <ChatScrollAnchor messages={messages} />
          </>
        ) : (
          <ChatEmptyScreen onSuggestionClick={onSubmit} />
        )}
      </div>
      <ChatPanel
        onSubmit={onSubmit}
      />
    </>
  );
}
