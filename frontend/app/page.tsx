"use client";

import ChatLayout from "@/components/layout/ChatLayout";
import Sidebar from "@/components/layout/Sidebar";
import { users } from "@/data/users";
import { messages as initialMessages } from "@/data/messages";
import { Message } from "@/types/message";
import { useState } from "react";

export default function Home() {
  const [selectedUser, setSelectedUser] = useState(users[0]);
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const handleSendMessage = (text: string) => {
    const newMessage: Message = {
      id: crypto.randomUUID(),
      userId: selectedUser.id,
      text,
      isOwn: true,
    };

    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <main className="h-dvh flex p-4 gap-4">
      <Sidebar selectedUser={selectedUser} onSelectUser={setSelectedUser} />
      <ChatLayout
        selectedUser={selectedUser}
        messages={messages}
        onSendMessage={handleSendMessage}
      />
    </main>
  );
}
