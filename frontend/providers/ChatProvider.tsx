"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { User } from "@/types/user";
import { Message } from "@/types/message";
import { users as initialUsers } from "@/data/users";
import { messages as initialMessages } from "@/data/messages";

type ChatContextValue = {
  users: User[];
  selectedUser: User | null;
  messages: Message[];
  selectUser: (user: User) => void;
  sendMessage: (text: string) => void;
};

const ChatContext = createContext<ChatContextValue | null>(null);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [messagesByConversation, setMessagesByConversation] =
    useState<Record<string, Message[]>>(initialMessages);

  const selectUser = (user: User) => {
    setSelectedUser(user);
  };

  const sendMessage = (text: string) => {
    if (!selectedUser) return;

    const newMessage: Message = {
      id: crypto.randomUUID(),
      conversationId: selectedUser.conversationId,
      text,
      isOwn: true,
    };

    setMessagesByConversation((prev) => ({
      ...prev,
      [selectedUser.conversationId]: [
        ...(prev[selectedUser.conversationId] ?? []),
        newMessage,
      ],
    }));

    setUsers((prev) =>
      prev.map((u) =>
        u.id === selectedUser.id ? { ...u, lastMessage: text } : u,
      ),
    );
  };

  const messages = selectedUser
    ? (messagesByConversation[selectedUser.conversationId] ?? [])
    : [];

  return (
    <ChatContext.Provider
      value={{
        users,
        selectedUser,
        messages,
        selectUser,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within ChatProvider");
  }
  return context;
};

export const useChat = () => useChatContext();
