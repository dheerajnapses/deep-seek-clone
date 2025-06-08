import Conversations from "./Conversations";

export default  function Page({ params }: { params: { id: string } }) {
  return <Conversations id={params.id}  />;
}
