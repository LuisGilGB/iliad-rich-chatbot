// Inspired by Chatbot-UI and modified to fit the needs of this project
// @see https://github.com/mckaywrigley/chatbot-ui/blob/main/components/Chat/ChatMessage.tsx

import { ChatMessageActions } from '@/components/chat/ChatMessageActions';
import { Markdown } from '@/components/markdown';
import { IconOpenAI, IconUser } from '@/components/ui/icons';

import { cn } from '@/lib/utils';
import { Message } from 'ai';

export interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message, ...props }: ChatMessageProps) {
  return (
    <div
      className={cn('group relative mb-4 flex items-start md:-ml-12')}
      {...props}
    >
      <div
        className={cn(
          'flex size-8 shrink-0 select-none items-center justify-center rounded-md border shadow-sm',
          message.role === 'user'
            ? 'bg-background'
            : 'bg-primary text-primary-foreground',
        )}
      >
        {message.role === 'user' ? <IconUser /> : <IconOpenAI />}
      </div>
      <div className="flex-1 px-1 ml-4 space-y-2 overflow-hidden">
        <Markdown>
          {message.content}
        </Markdown>
        <ChatMessageActions message={message} />
      </div>
    </div>
  );
}
