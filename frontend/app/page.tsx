"use client";

import ChatLayout from "@/components/layout/ChatLayout";
import Sidebar from "@/components/layout/Sidebar";
import { users as initialUsers } from "@/data/users";
import { messages as initialMessages } from "@/data/messages";
import { Message } from "@/types/message";
import { useState } from "react";
import { User } from "@/types/user";

export default function Home() {
  const [selectedUser, setSelectedUser] = useState<User | null>(
    initialUsers.length > 0 ? initialUsers[0] : null,
  );
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [messages, setMessages] =
    useState<Record<string, Message[]>>(initialMessages);

  const handleSendMessage = (text: string) => {
    if (!selectedUser) return;

    const newMessage: Message = {
      id: crypto.randomUUID(),
      conversationId: selectedUser.conversationId,
      text,
      isOwn: true,
    };

    setMessages((prev) => ({
      ...prev,
      [selectedUser.conversationId]: [
        ...(prev[selectedUser.conversationId] ?? []),
        newMessage,
      ],
    }));

    setUsers((prev) =>
      prev.map((user) =>
        user.id === selectedUser.id ? { ...user, lastMessage: text } : user,
      ),
    );
  };

  return (
    <main className="h-dvh flex p-4 gap-4">
      <Sidebar
        users={users}
        selectedUser={selectedUser}
        onSelectUser={setSelectedUser}
      />
      <ChatLayout
        selectedUser={selectedUser}
        messages={selectedUser ? (messages[selectedUser.conversationId] ?? []) : []}
        onSendMessage={handleSendMessage}
      />
    </main>
  );
}
