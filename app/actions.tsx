'use server'

import config from '@/app/config'
import { openai } from '@/app/openai'
import { auth } from '@/auth'
import { type Chat } from '@/lib/types'
import { kv } from '@vercel/kv'

import { createAI, getMutableAIState, render } from 'ai/rsc'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

export async function getChats(userId?: string | null) {
  if (!config.USE_KV) {
    return []
  }
  if (!userId) {
    return []
  }

  try {
    const pipeline = kv.pipeline()
    const chats: string[] = await kv.zrange(`user:chat:${userId}`, 0, -1, {
      rev: true
    })

    for (const chat of chats) {
      pipeline.hgetall(chat)
    }

    const results = await pipeline.exec()

    return results as Chat[]
  } catch (error) {
    return []
  }
}

export async function getChat(id: string, userId: string) {
  if (!config.USE_KV) {
    return null
  }
  const chat = await kv.hgetall<Chat>(`chat:${id}`)

  if (!chat || (userId && chat.userId !== userId)) {
    return null
  }

  return chat
}

export async function removeChat({ id, path }: { id: string; path: string }) {
  if (!config.USE_KV) {
    return
  }

  const session = await auth()

  if (!session) {
    return {
      error: 'Unauthorized'
    }
  }

  //Convert uid to string for consistent comparison with session.user.id
  const uid = String(await kv.hget(`chat:${id}`, 'userId'))

  if (uid !== session?.user?.id) {
    return {
      error: 'Unauthorized'
    }
  }

  await kv.del(`chat:${id}`)
  await kv.zrem(`user:chat:${session.user.id}`, `chat:${id}`)

  revalidatePath('/')
  return revalidatePath(path)
}

export async function clearChats() {
  if (!config.USE_KV) {
    return
  }
  const session = await auth()

  if (!session?.user?.id) {
    return {
      error: 'Unauthorized'
    }
  }

  const chats: string[] = await kv.zrange(`user:chat:${session.user.id}`, 0, -1)
  if (!chats.length) {
    return redirect('/')
  }
  const pipeline = kv.pipeline()

  for (const chat of chats) {
    pipeline.del(chat)
    pipeline.zrem(`user:chat:${session.user.id}`, chat)
  }

  await pipeline.exec()

  revalidatePath('/')
  return redirect('/')
}

export async function getSharedChat(id: string) {
  if (!config.USE_KV) {
    return null
  }
  const chat = await kv.hgetall<Chat>(`chat:${id}`)

  if (!chat || !chat.sharePath) {
    return null
  }

  return chat
}

export async function shareChat(id: string) {
  if (!config.USE_KV) {
    return null
  }
  const session = await auth()

  if (!session?.user?.id) {
    return {
      error: 'Unauthorized'
    }
  }

  const chat = await kv.hgetall<Chat>(`chat:${id}`)

  if (!chat || chat.userId !== session.user.id) {
    return {
      error: 'Something went wrong'
    }
  }

  const payload = {
    ...chat,
    sharePath: `/share/${chat.id}`
  }

  await kv.hmset(`chat:${chat.id}`, payload)

  return payload
}

async function submitUserMessage(userInput: string) {
  'use server'

  const aiState = getMutableAIState<typeof AI>()

  // Update AI state with new message.
  aiState.update([
    ...aiState.get(),
    {
      role: 'user',
      content: userInput
    }
  ])

  // render() returns a stream of UI components
  const ui = render({
    model: 'gpt-3.5-turbo',
    provider: openai,
    messages: [
      {
        role: 'system',
        content:
          'Hi! I can give you information about who is who in The Iliad. Ask me anything!'
      },
      {
        role: 'user',
        content: userInput
      }
    ],
    // `text` is called when an AI returns a text response (as opposed to a tool call)
    text: ({ content, done }: { content: string; done: boolean }) => {
      // text can be streamed from the LLM, but we only want to close the stream with .done() when its completed.
      // done() marks the state as available for the client to access
      if (done) {
        aiState.update([
          ...aiState.get(),
          {
            role: 'assistant',
            content
          }
        ])
      }

      return (
        <div className="p-2 bg-gray-900 space-y-2 rounded-md">
          <h5 className="text-white">AI Response</h5>
          <p className="text-white">{content}</p>
        </div>
      )
    },
    tools: {
      get_character_info: {
        description: 'Get information about a character in The Iliad',
        parameters: z
          .object({
            name: z.string().describe('The name of the character'),
            side: z
              .enum(['Greek', 'Trojan'])
              .describe('The side of the character'),
            origin: z.string().describe('The city of origin of the character'),
            father: z.string().describe('The father of the character'),
            survives: z
              .boolean()
              .describe(
                'Whether the character survives until the end of the poem'
              )
          })
          .required(),
        render: async function* ({
          name,
          side,
          origin,
          father,
          survives
        }: {
          name: string
          side: 'Greek' | 'Trojan'
          origin: string
          father: string
          survives: boolean
        }) {
          yield (
            <div className="p-2 bg-gray-500 rounded-md w-48 h-16">
              <p>Loading...</p>
            </div>
          )

          aiState.done([
            ...aiState.get(),
            {
              role: 'function',
              name: 'get_character_info',
              content: JSON.stringify({ name, side, origin, father, survives })
            }
          ])

          return (
            <div className="p-2 bg-gray-900 space-y-2 rounded-md">
              <h5 className="text-white text-lg">{name}</h5>
              <div>
                <p className="text-white">Side: {side}</p>
                <p className="text-white">Origin: {origin}</p>
                <p className="text-white">Father: {father}</p>
                <p className="text-white">
                  Survives: {survives ? 'Yes' : 'No'}
                </p>
              </div>
            </div>
          )
        }
      }
    }
  })

  return {
    id: Date.now(),
    display: ui
  }
}

// Define the initial state of the AI. It can be any JSON object.
const initialAIState: {
  role: 'user' | 'assistant' | 'system' | 'function'
  content: string
  id?: string
  name?: string
}[] = []

// The initial UI state that the client will keep track of.
const initialUIState: {
  id: number
  display: React.ReactNode
}[] = []

// AI is a provider you wrap your application with so you can access AI and UI state in your components.
export const AI = createAI({
  actions: {
    submitUserMessage
  },
  // Each state can be any shape of object, but for chat applications
  // it makes sense to have an array of messages. Or you may prefer something like { id: number, messages: Message[] }
  initialUIState,
  initialAIState
})
