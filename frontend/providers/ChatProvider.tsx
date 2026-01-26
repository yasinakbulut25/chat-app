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
import { User } from "@/types/user";
import { Message } from "@/types/message";
import { MESSAGE_SUBSCRIPTION } from "@/graphql/subscriptions";

type ChatContextValue = {
  users: User[];
  selectedUser: User | null;
  messages: Message[];
  loading: boolean;
  selectUser: (user: User) => void;
  sendMessage: (text: string) => Promise<void>;
};

type MessageAddedResponse = {
  messageAdded: {
    id: string;
    conversationId: string;
    text: string;
    senderId: string;
    __typename: "Message";
  };
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
      __typename: "Message";
    };
  }>(SEND_MESSAGE);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!selectedUser || !text.trim()) return;

      const optimisticId = `optimistic-${Date.now()}`;

      await sendMessageMutation({
        variables: {
          conversationId: selectedUser.id,
          text: text.trim(),
        },

        optimisticResponse: {
          sendMessage: {
            id: optimisticId,
            conversationId: selectedUser.id,
            text,
            senderId: CURRENT_USER_ID,
            __typename: "Message",
          },
        },

        update: (cache, { data }) => {
          if (!data?.sendMessage) return;

          const existing = cache.readQuery<{
            messages: {
              id: string;
              conversationId: string;
              text: string;
              senderId: string;
              __typename: string;
            }[];
          }>({
            query: GET_MESSAGES,
            variables: { conversationId: selectedUser.id },
          });

          if (!existing) return;

          cache.writeQuery({
            query: GET_MESSAGES,
            variables: { conversationId: selectedUser.id },
            data: {
              messages: [...existing.messages, data.sendMessage],
            },
          });
        },
      });
    },
    [selectedUser, sendMessageMutation],
  );

  const selectUser = (user: User) => {
    setSelectedUser(user);
  };

  useSubscription<MessageAddedResponse>(MESSAGE_SUBSCRIPTION, {
    skip: !selectedUser,
    variables: {
      conversationId: selectedUser?.id,
    },
    onData: ({ client, data }) => {
      const newMessage = data.data?.messageAdded;
      if (!newMessage || !selectedUser) return;

      const existing = client.readQuery<{
        messages: {
          id: string;
          conversationId: string;
          text: string;
          senderId: string;
          __typename: string;
        }[];
      }>({
        query: GET_MESSAGES,
        variables: { conversationId: selectedUser.id },
      });

      if (!existing) return;

      if (existing.messages.some((m) => m.id === newMessage.id)) return;

      client.writeQuery({
        query: GET_MESSAGES,
        variables: { conversationId: selectedUser.id },
        data: {
          messages: [...existing.messages, newMessage],
        },
      });
    },
  });

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
