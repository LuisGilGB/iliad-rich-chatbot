import { ButtonScrollToBottom } from '@/components/button-scroll-to-bottom';
import { FooterText } from '@/components/footer';
import { PromptForm } from '@/components/PromptForm';
import * as React from 'react';

export interface ChatPanelProps {
  onSubmit: (content: string) => Promise<unknown>;
}

export const ChatPanel = ({
  onSubmit,
}: ChatPanelProps) => {
  return (
    <div className="fixed inset-x-0 bottom-0 w-full bg-linear-to-b from-muted/30 from-0% to-muted/30 to-50% animate-in duration-300 ease-in-out dark:from-background/10 dark:from-10% dark:to-background/80 lg:in-[.group]:peer-data-[state=open]:pl-[250px] xl:in-[.group]:peer-data-[state=open]:pl-[300px]">
      <ButtonScrollToBottom />
      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="px-4 py-2 space-y-4 border-t shadow-lg bg-background sm:rounded-t-xl sm:border md:py-4">
          <PromptForm onSubmit={onSubmit} />
          <FooterText className="hidden sm:block" />
        </div>
      </div>
    </div>
  );
}
