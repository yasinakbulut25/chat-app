"use client";

import ChatHeader from "@/components/chat/ChatHeader";
import MessageList from "@/components/chat/MessageList";
import MessageInput from "@/components/chat/MessageInput";
import { useChat } from "@/providers/ChatProvider";

export default function ChatLayout() {
  const { selectedUser, messages } = useChat();

  if (!selectedUser) {
    return (
      <section className="flex-1 flex items-center justify-center text-slate-400">
        Bir kullanıcı seç
      </section>
    );
  }

  return (
    <section className="h-full bg-white flex-1 flex flex-col rounded-xl overflow-x-hidden">
      <ChatHeader user={selectedUser} />
      <MessageList user={selectedUser} messages={messages} />
      <MessageInput />
    </section>
  );
}
