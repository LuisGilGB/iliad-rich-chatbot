'use client'

import * as React from 'react'
import { useInView } from 'react-intersection-observer'


interface ChatScrollAnchorProps {
  messages?: any[]
}

export const ChatScrollAnchor = ({ messages = [] }: ChatScrollAnchorProps) => {
  const { ref } = useInView()
  const scrollTargetRef = React.useRef<HTMLDivElement>(null)

  // Efecto para hacer scroll al último mensaje cuando cambia la lista de mensajes
  React.useEffect(() => {
    if (messages.length > 0 && scrollTargetRef.current) {
      scrollTargetRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }, [messages])

  return (
    <div ref={scrollTargetRef} className="h-px w-full">
      <div ref={ref} />
    </div>
  )
}
