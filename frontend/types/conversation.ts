import { Message } from "./message";

export type Conversation = {
  id: string;
  participantIds: string[];
  lastMessage: Message | null;
  updatedAt: string;
};

export type CreateConversationResponse = {
  createConversation: Conversation;
};
