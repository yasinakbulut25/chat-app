import ChatHeader from "@/components/chat/ChatHeader";
import MessageList from "@/components/chat/MessageList";
import MessageInput from "@/components/chat/MessageInput";

export default function ChatLayout() {
  return (
    <section className="h-full bg-white flex-1 flex flex-col rounded-xl overflow-x-hidden">
      <ChatHeader />
      <MessageList />
      <MessageInput />
    </section>
  );
}
