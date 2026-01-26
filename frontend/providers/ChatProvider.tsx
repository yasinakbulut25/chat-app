"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useCallback,
} from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { GET_USERS } from "@/graphql/queries/users";
import { GET_MESSAGES } from "@/graphql/queries/messages";
import { SEND_MESSAGE } from "@/graphql/mutations/sendMessage";
import { User } from "@/types/user";
import { Message } from "@/types/message";

type ChatContextValue = {
  users: User[];
  selectedUser: User | null;
  messages: Message[];
  loading: boolean;
  selectUser: (user: User) => void;
  sendMessage: (text: string) => Promise<void>;
};

const ChatContext = createContext<ChatContextValue | null>(null);

const CURRENT_USER_ID = "me";

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { data: usersData, loading: usersLoading } = useQuery<{
    users: User[];
  }>(GET_USERS);
  const users = useMemo<User[]>(() => {
    return usersData?.users ?? [];
  }, [usersData]);
  const { data: messagesData, loading: messagesLoading } = useQuery<{
    messages: {
      id: string;
      conversationId: string;
      text: string;
      senderId: string;
    }[];
  }>(GET_MESSAGES, {
    variables: {
      conversationId: selectedUser?.id ?? "",
    },
    skip: !selectedUser,
  });

  const messages = useMemo<Message[]>(() => {
    if (!messagesData?.messages) return [];

    return messagesData.messages.map((msg) => ({
      id: msg.id,
      userId: msg.senderId,
      text: msg.text,
      conversationId: msg.conversationId,
      isOwn: msg.senderId === CURRENT_USER_ID,
    }));
  }, [messagesData]);

  const [sendMessageMutation] = useMutation<{
    sendMessage: {
      id: string;
      conversationId: string;
      text: string;
      senderId: string;
    };
  }>(SEND_MESSAGE);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!selectedUser || !text.trim()) return;

      await sendMessageMutation({
        variables: {
          conversationId: selectedUser.id,
          text: text.trim(),
        },
      });
    },
    [selectedUser, sendMessageMutation],
  );

  const selectUser = (user: User) => {
    setSelectedUser(user);
  };

  const value = useMemo<ChatContextValue>(
    () => ({
      users,
      selectedUser,
      messages,
      loading: usersLoading || messagesLoading,
      selectUser,
      sendMessage,
    }),
    [users, selectedUser, messages, usersLoading, messagesLoading, sendMessage],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within ChatProvider");
  }
  return context;
};

export const useChat = () => useChatContext();
