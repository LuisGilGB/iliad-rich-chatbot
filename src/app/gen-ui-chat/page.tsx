'use client';

import { AIProvider } from '@/app/actions';
import { useActions, useUIState } from 'ai/rsc';
import { useState } from 'react';

export default function Page() {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useUIState<typeof AIProvider>();
  const { submitUserMessage } = useActions<typeof AIProvider>();

  return (
    <div className="flex flex-col w-full max-w-[720px] mx-auto p-12">
      <div>
        {
          // View messages in UI state
          messages.map(message => (
            <div key={message.id}>{message.display}</div>
          ))
        }

        <form
          onSubmit={async e => {
            e.preventDefault();

            // Add user message to UI state
            setMessages(currentMessages => [
              ...currentMessages,
              {
                id: Date.now(),
                display: <div className="bg-green-300">{inputValue}</div>,
              },
            ]);

            // Submit and get response message
            const responseMessage = await submitUserMessage(inputValue);
            setMessages(currentMessages => [
              ...currentMessages,
              responseMessage,
            ]);

            setInputValue('');
          }}
        >
          <input
            placeholder="Send a message..."
            value={inputValue}
            onChange={event => {
              setInputValue(event.target.value);
            }}
          />
        </form>
      </div>
    </div>
  );
}
