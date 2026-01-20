import ChatHeader from "@/components/chat/ChatHeader";
import MessageList from "@/components/chat/MessageList";
import MessageInput from "@/components/chat/MessageInput";
import { User } from "@/types/user";

type Props = {
  selectedUser: User;
};

export default function ChatLayout({ selectedUser }: Props) {
  return (
    <section className="h-full bg-white flex-1 flex flex-col rounded-xl overflow-x-hidden">
      <ChatHeader user={selectedUser} />
      <MessageList user={selectedUser} />
      <MessageInput />
    </section>
  );
}
