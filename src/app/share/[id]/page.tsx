import { FooterText } from '@/components/footer';
import { getSharedChat } from '@/infrastructure/repositories/chat.repository';

import { formatDate } from '@/lib/utils';
import { type Metadata } from 'next';
import { notFound } from 'next/navigation';

interface SharePageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata(props: SharePageProps): Promise<Metadata> {
  const params = await props.params;
  const chat = await getSharedChat(params.id);

  return {
    title: chat?.title.slice(0, 50) ?? 'Chat',
  };
}

export default async function SharePage(props: SharePageProps) {
  const params = await props.params;
  const chat = await getSharedChat(params.id);

  if (!chat || !chat?.sharePath) {
    notFound();
  }

  return (
    <>
      <div className="flex-1 space-y-6">
        <div className="px-4 py-6 border-b bg-background md:px-6 md:py-8">
          <div className="max-w-2xl mx-auto md:px-6">
            <div className="space-y-1 md:-mx-8">
              <h1 className="text-2xl font-bold">{chat.title}</h1>
              <div className="text-sm text-muted-foreground">
                {formatDate(chat.createdAt)} · {chat.messages.length} messages
              </div>
            </div>
          </div>
        </div>
        {/*<ChatList messages={chat.messages} />*/}
      </div>
      <FooterText className="py-8" />
    </>
  );
}
