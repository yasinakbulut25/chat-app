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
  CONVERSATION_UPDATED_SUBSCRIPTION,
  MESSAGE_SUBSCRIPTION,
  USER_ADDED_SUBSCRIPTION,
} from "@/graphql/subscriptions";

import { Message, MessageDTO } from "@/types/message";
import { User } from "@/types/user";
import { useAuth } from "./AuthContext";
import { CREATE_CONVERSATION } from "@/graphql/mutations/createConversation";
import { Conversation, CreateConversationResponse } from "@/types/conversation";
import { GET_CONVERSATIONS } from "@/graphql/queries/conversations";

type ChatContextValue = {
  users: User[];
  selectedUser: User | null;
  messages: Message[];
  conversations: Conversation[];
  loading: boolean;
  activeConversationId: string | null;
  selectUser: (user: User) => void;
  sendMessage: (content: string) => Promise<void>;
};

type ApiMessage = {
  id: string;
  conversationId: string;
  content: string;
  senderId: string;
  createdAt: string;
};

type MessageAddedResponse = {
  messageAdded: ApiMessage;
};

const localActiveConversationIdKey = "activeConversationId";

const ChatContext = createContext<ChatContextValue | null>(null);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const currentUserId = user?.id ?? "";

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(() => {
    if (typeof window === "undefined") return null;
    const convId = localStorage.getItem(localActiveConversationIdKey);
    return convId ? convId : null;
  });

  const { data: usersData, loading: usersLoading } = useQuery<{
    users: User[];
  }>(GET_USERS);

  const users = useMemo(() => {
    return (usersData?.users ?? []).filter((u) => u.id !== currentUserId);
  }, [usersData, currentUserId]);

  const { data: messagesData, loading: messagesLoading } = useQuery<{
    messages: ApiMessage[];
  }>(GET_MESSAGES, {
    variables: { conversationId: activeConversationId },
    skip: !activeConversationId,
    fetchPolicy: "cache-and-network",
  });

  const messages = useMemo<Message[]>(() => {
    if (!messagesData?.messages) return [];

    return messagesData.messages.map((msg: MessageDTO) => ({
      ...msg,
      isOwn: msg.senderId === currentUserId,
    }));
  }, [messagesData, currentUserId]);

  const { data: conversationsData, loading: conversationsLoading } = useQuery<{
    conversations: Conversation[];
  }>(GET_CONVERSATIONS, {
    variables: { userId: currentUserId },
    skip: !currentUserId,
  });

  const conversations = useMemo<Conversation[]>(() => {
    if (!conversationsData?.conversations) return [];

    return conversationsData.conversations;
  }, [conversationsData]);

  const [sendMessageMutation] = useMutation<{ sendMessage: ApiMessage }>(
    SEND_MESSAGE,
  );

  const [createConversationMutation] =
    useMutation<CreateConversationResponse>(CREATE_CONVERSATION);

  const selectUser = useCallback(
    async (user: User) => {
      setSelectedUser(user);

      const { data } = await createConversationMutation({
        variables: { participantIds: [currentUserId, user.id] },
      });
      const newConvId = data?.createConversation?.id;
      if (!newConvId) return;

      setActiveConversationId(newConvId);
      if (typeof window !== "undefined") {
        localStorage.setItem(localActiveConversationIdKey, newConvId);
      }
    },
    [currentUserId, createConversationMutation],
  );

  const sendMessage = useCallback(
    async (content: string) => {
      if (
        !selectedUser ||
        !currentUserId ||
        !content.trim() ||
        !activeConversationId
      )
        return;

      await sendMessageMutation({
        variables: {
          conversationId: activeConversationId,
          senderId: currentUserId,
          content: content.trim(),
        },
      });
    },
    [selectedUser, currentUserId, activeConversationId, sendMessageMutation],
  );

  useSubscription<MessageAddedResponse>(MESSAGE_SUBSCRIPTION, {
    skip: !activeConversationId,
    variables: { conversationId: activeConversationId ?? "" },
    onData: ({ client, data }) => {
      const newMessage = data.data?.messageAdded;
      if (!newMessage || !activeConversationId) return;

      const existing = client.readQuery<{ messages: ApiMessage[] }>({
        query: GET_MESSAGES,
        variables: { conversationId: activeConversationId },
      });

      if (!existing) return;
      if (existing.messages.some((m) => m.id === newMessage.id)) return;

      client.writeQuery({
        query: GET_MESSAGES,
        variables: { conversationId: activeConversationId },
        data: { messages: [...existing.messages, newMessage] },
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

  useSubscription<{ conversationUpdated: Conversation }>(
    CONVERSATION_UPDATED_SUBSCRIPTION,
    {
      skip: !currentUserId,
      variables: { userId: currentUserId },
      onData: ({ client, data }) => {
        const updated = data.data?.conversationUpdated;
        if (!updated) return;

        const existing = client.readQuery<{
          conversations: Conversation[];
        }>({
          query: GET_CONVERSATIONS,
          variables: { userId: currentUserId },
        });

        if (!existing) return;

        const others = existing.conversations.filter(
          (c) => c.id !== updated.id,
        );

        client.writeQuery({
          query: GET_CONVERSATIONS,
          variables: { userId: currentUserId },
          data: {
            conversations: [updated, ...others].sort(
              (a, b) =>
                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime(),
            ),
          },
        });
      },
    },
  );

  const value = useMemo<ChatContextValue>(
    () => ({
      users,
      selectedUser,
      messages,
      conversations,
      loading: usersLoading || messagesLoading || conversationsLoading,
      activeConversationId,
      selectUser,
      sendMessage,
    }),
    [
      users,
      selectedUser,
      messages,
      conversations,
      usersLoading,
      messagesLoading,
      conversationsLoading,
      activeConversationId,
      selectUser,
      sendMessage,
    ],
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
