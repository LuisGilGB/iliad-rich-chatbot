import { Separator } from '@/components/ui/Separator';
import { ReactNode } from 'react';

export interface ChatList {
  messages: {
    id: number;
    display: ReactNode;
  }[];
}

export function ChatList({ messages }: ChatList) {
  if (!messages.length) {
    return null;
  }

  return (
    <div className="relative mx-auto max-w-2xl px-4">
      {messages.map((message, index) => (
        <div key={index}>
          {message.display}
          {index < messages.length - 1 && (
            <Separator className="my-4 md:my-8" />
          )}
        </div>
      ))}
    </div>
  );
}
