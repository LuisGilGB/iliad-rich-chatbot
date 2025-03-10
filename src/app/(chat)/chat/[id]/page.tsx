import { auth } from '@/auth';
import { Chat } from '@/components/chat/Chat';
import { getChat } from '@/infrastructure/repositories/chat.repository';
import { type Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

export interface ChatPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata(props: ChatPageProps): Promise<Metadata> {
  const params = await props.params;
  const session = await auth();

  if (!session?.user) {
    return {};
  }

  const chat = await getChat(params.id, session.user.id);
  return {
    title: chat?.title.toString().slice(0, 50) ?? 'Chat',
  };
}

export default async function ChatPage(props: ChatPageProps) {
  const params = await props.params;
  const session = await auth();

  if (!session?.user) {
    redirect(`/sign-in?next=/chat/${params.id}`);
  }

  const chat = await getChat(params.id, session.user.id);

  if (!chat) {
    notFound();
  }

  if (chat?.userId !== session?.user?.id) {
    notFound();
  }

  return <Chat id={chat.id} initialMessages={chat.messages} />;
}
