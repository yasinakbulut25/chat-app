import ChatHeader from "@/components/chat/ChatHeader";
import MessageList from "@/components/chat/MessageList";
import MessageInput from "@/components/chat/MessageInput";

export default function ChatLayout() {
  return (
    <section className="flex-1 flex flex-col">
      <ChatHeader />
      <MessageList />
      <MessageInput />
    </section>
  );
}
