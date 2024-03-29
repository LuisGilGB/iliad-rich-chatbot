import { Message } from '@/domain/chat/Message';

type MessageParams = Omit<Message, 'id'>;

export const createNewMessage = (messageParams: MessageParams): Message => ({
  ...messageParams,
  id: Date.now().toString(),
});

export const appendMessage = (
  messages: Message[],
  newMessage: Message,
): Message[] => [...messages, newMessage];

export const appendNewMessage = (
  previousMessages: Message[],
  messageParams: MessageParams,
): Message[] =>
  appendMessage(previousMessages, createNewMessage(messageParams));
