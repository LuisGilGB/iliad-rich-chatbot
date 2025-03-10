import { Button } from '@/components/ui/button';
import { IconArrowElbow } from '@/components/ui/icons';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit';
import * as React from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import Textarea from 'react-textarea-autosize';

export interface PromptProps {
  onSubmit: (value: string) => void;
}

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      size="icon"
      disabled={pending}
    >
      <IconArrowElbow />
      <span className="sr-only">Send message</span>
    </Button>
  );
};

export const PromptForm = ({
  onSubmit,
}: PromptProps) => {
  const { formRef, onKeyDown } = useEnterSubmit();
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  // Función para manejar la acción del formulario
  const formAction = async (prevState: any, formData: FormData) => {
    const message = formData.get('message') as string;
    if (!message?.trim()) return prevState;
    onSubmit(message);
    return { submitted: true };
  };

  const [state, action, isPending] = useActionState(formAction, null);

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <form
      action={action}
      ref={formRef}
    >
      <div className="relative flex flex-col w-full pr-14 overflow-hidden max-h-60 grow bg-background sm:rounded-md sm:border">
        <Textarea
          ref={inputRef}
          name="message"
          tabIndex={0}
          rows={1}
          placeholder="Send a message."
          spellCheck={false}
          className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-hidden sm:text-sm"
          onKeyDown={onKeyDown}
        />
        <div className="absolute right-0 top-4 sm:right-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <SubmitButton />
            </TooltipTrigger>
            <TooltipContent>Send message</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </form>
  );
}
