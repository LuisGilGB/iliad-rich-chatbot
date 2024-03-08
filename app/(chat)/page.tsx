import { Chat } from '@/components/Chat';
import { nanoid } from '@/lib/utils';

export default function IndexPage() {
  const id = nanoid();

  return <Chat id={id} />;
}
