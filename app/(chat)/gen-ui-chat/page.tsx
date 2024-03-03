'use client'

import { useState } from 'react'
import { useActions, useUIState } from 'ai/rsc'
import { AI } from '@/app/actions'

export default function Page() {
  const [inputValue, setInputValue] = useState('')
  const [messages, setMessages] = useUIState<typeof AI>()
  const { submitUserMessage } = useActions<typeof AI>()

  return (
    <div>
      {
        // View messages in UI state
        messages.map((message: typeof AI) => (
          <div key={message.id}>{message.display}</div>
        ))
      }

      <form
        onSubmit={async e => {
          e.preventDefault()

          // Add user message to UI state
          setMessages((currentMessages: (typeof AI)[]) => [
            ...currentMessages,
            {
              id: Date.now(),
              display: <div className="bg-green-300">{inputValue}</div>
            }
          ])

          // Submit and get response message
          const responseMessage = await submitUserMessage(inputValue)
          setMessages((currentMessages: (typeof AI)[]) => [
            ...currentMessages,
            responseMessage
          ])

          setInputValue('')
        }}
      >
        <input
          placeholder="Send a message..."
          value={inputValue}
          onChange={event => {
            setInputValue(event.target.value)
          }}
        />
      </form>
    </div>
  )
}
