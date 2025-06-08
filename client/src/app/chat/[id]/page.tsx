import Conversations from "./Conversations";

export default async function ChatPage({ params }: { params: { id: string } }) {
  const { id } = await params; 
  return <Conversations id={id} />;
}
