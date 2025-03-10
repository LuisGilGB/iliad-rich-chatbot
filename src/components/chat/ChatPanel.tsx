import { ButtonScrollToBottom } from '@/components/button-scroll-to-bottom';
import { FooterText } from '@/components/footer';
import { PromptForm } from '@/components/PromptForm';
import { type UseChatHelpers } from 'ai/react';
import * as React from 'react';
import { ReactNode } from 'react';

export interface ChatPanelProps
  extends Pick<UseChatHelpers, 'isLoading' | 'stop' | 'input' | 'setInput'> {
  id?: string;
  title?: string;
  messages: { id: number; display: ReactNode }[];
  onReloadClick: () => void;
  onSubmit: (content: string) => Promise<unknown>;
}

export function ChatPanel({
  id,
  title,
  isLoading,
  stop,
  onReloadClick,
  input,
  setInput,
  messages,
  onSubmit,
}: ChatPanelProps) {
  const [shareDialogOpen, setShareDialogOpen] = React.useState(false);

  return (
    <div className="fixed inset-x-0 bottom-0 w-full bg-linear-to-b from-muted/30 from-0% to-muted/30 to-50% animate-in duration-300 ease-in-out dark:from-background/10 dark:from-10% dark:to-background/80 lg:in-[.group]:peer-data-[state=open]:pl-[250px] xl:in-[.group]:peer-data-[state=open]:pl-[300px]">
      <ButtonScrollToBottom />
      <div className="mx-auto sm:max-w-2xl sm:px-4">
        {
          //TODO: Restore functionality but using server actions instead of the unused client actions
          /*<div className="flex items-center justify-center h-12">
          {isLoading ? (
            <Button
              variant="outline"
              onClick={() => stop()}
              className="bg-background"
            >
              <IconStop className="mr-2" />
              Stop generating
            </Button>
          ) : (
            messages?.length >= 2 && (
              <div className="flex space-x-2">
                <Button variant="outline" onClick={onReloadClick}>
                  <IconRefresh className="mr-2" />
                  Regenerate response
                </Button>
                {id && title ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setShareDialogOpen(true)}
                    >
                      <IconShare className="mr-2" />
                      Share
                    </Button>
                    <ChatShareDialog
                      open={shareDialogOpen}
                      onOpenChange={setShareDialogOpen}
                      onCopy={() => setShareDialogOpen(false)}
                      shareChat={shareChat}
                      chat={{
                        id,
                        title,
                        messages,
                      }}
                    />
                  </>
                ) : null}
              </div>
            )
          )}
        </div>*/
        }
        <div className="px-4 py-2 space-y-4 border-t shadow-lg bg-background sm:rounded-t-xl sm:border md:py-4">
          <PromptForm
            onSubmit={onSubmit}
            input={input}
            setInput={setInput}
            isLoading={isLoading}
          />
          <FooterText className="hidden sm:block" />
        </div>
      </div>
    </div>
  );
}
