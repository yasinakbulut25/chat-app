"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useCallback,
} from "react";
import { useMutation, useQuery, useSubscription } from "@apollo/client/react";

import { GET_USERS } from "@/graphql/queries/users";
import { GET_MESSAGES } from "@/graphql/queries/messages";
import { SEND_MESSAGE } from "@/graphql/mutations/sendMessage";
import {
  MESSAGE_SUBSCRIPTION,
  USER_ADDED_SUBSCRIPTION,
} from "@/graphql/subscriptions";

import { Message } from "@/types/message";
import { User } from "@/types/user";
import { useAuth } from "./AuthContext";
import { getConversationId } from "@/utils";

type ChatContextValue = {
  users: User[];
  selectedUser: User | null;
  messages: Message[];
  loading: boolean;
  selectUser: (user: User) => void;
  sendMessage: (content: string) => Promise<void>;
};

type ApiMessage = {
  id: string;
  conversationId: string;
  content: string;
  senderId: string;
  createdAt: string;
  __typename?: "Message";
};

type MessageAddedResponse = {
  messageAdded: ApiMessage;
};

const ChatContext = createContext<ChatContextValue | null>(null);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const currentUserId = user?.id ?? "";

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { data: usersData, loading: usersLoading } = useQuery<{
    users: User[];
  }>(GET_USERS);

  const users = useMemo<User[]>(() => {
    return usersData?.users ?? [];
  }, [usersData]);

  const conversationId = useMemo(() => {
    if (!selectedUser || !currentUserId) return null;
    return getConversationId(currentUserId, selectedUser.id);
  }, [currentUserId, selectedUser]);

  const { data: messagesData, loading: messagesLoading } = useQuery<{
    messages: ApiMessage[];
  }>(GET_MESSAGES, {
    variables: { conversationId: conversationId ?? "" },
    skip: !conversationId,
    fetchPolicy: "network-only",
  });

  const messages = useMemo<Message[]>(() => {
    if (!messagesData?.messages) return [];

    return messagesData.messages.map((msg) => ({
      id: msg.id,
      conversationId: msg.conversationId,
      content: msg.content,
      createdAt: msg.createdAt,
      userId: msg.senderId,
      isOwn: msg.senderId === currentUserId,
    }));
  }, [messagesData, currentUserId]);

  const [sendMessageMutation] = useMutation<{ sendMessage: ApiMessage }>(
    SEND_MESSAGE,
  );

  const sendMessage = useCallback(
    async (content: string) => {
      if (!conversationId || !currentUserId || !content.trim()) return;

      const optimisticId = `optimistic-${Date.now()}`;

      await sendMessageMutation({
        variables: {
          conversationId,
          senderId: currentUserId,
          content: content.trim(),
        },

        optimisticResponse: {
          sendMessage: {
            id: optimisticId,
            conversationId,
            content: content.trim(),
            senderId: currentUserId,
            createdAt: new Date().toISOString(),
            __typename: "Message",
          },
        },

        update: (cache, { data }) => {
          if (!data?.sendMessage) return;

          const existing = cache.readQuery<{ messages: ApiMessage[] }>({
            query: GET_MESSAGES,
            variables: { conversationId },
          });

          if (!existing) return;
          if (existing.messages.some((m) => m.id === data.sendMessage.id))
            return;

          cache.writeQuery({
            query: GET_MESSAGES,
            variables: { conversationId },
            data: {
              messages: [...existing.messages, data.sendMessage],
            },
          });
        },
      });
    },
    [conversationId, currentUserId, sendMessageMutation],
  );

  useSubscription<MessageAddedResponse>(MESSAGE_SUBSCRIPTION, {
    skip: !conversationId,
    variables: { conversationId },
    onData: ({ client, data }) => {
      const newMessage = data.data?.messageAdded;
      if (!newMessage || !conversationId) return;

      const existing = client.readQuery<{
        messages: ApiMessage[];
      }>({
        query: GET_MESSAGES,
        variables: { conversationId },
      });

      if (!existing) return;
      if (existing.messages.some((m) => m.id === newMessage.id)) return;

      client.writeQuery({
        query: GET_MESSAGES,
        variables: { conversationId },
        data: {
          messages: [...existing.messages, newMessage],
        },
      });
    },
  });

  useSubscription<{ userAdded: User }>(USER_ADDED_SUBSCRIPTION, {
    onData: ({ client, data }) => {
      const newUser = data.data?.userAdded;
      if (!newUser) return;

      const existing = client.readQuery<{ users: User[] }>({
        query: GET_USERS,
      });

      if (!existing) {
        client.writeQuery({
          query: GET_USERS,
          data: { users: [newUser] },
        });
        return;
      }

      if (existing.users.some((u) => u.id === newUser.id)) return;

      client.writeQuery({
        query: GET_USERS,
        data: {
          users: [...existing.users, newUser],
        },
      });
    },
  });

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
