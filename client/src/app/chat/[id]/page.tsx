import Conversations from "./Conversations";

interface ChatPageProps {
  params: {
    id: string;
  };
}

export default function ChatPage({ params }: ChatPageProps) {
  const { id } = params;
  return <Conversations id={id} />;
}
