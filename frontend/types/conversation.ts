export type LastMessage = {
  content: string;
  createdAt: string;
} | null;

export type Conversation = {
  id: string;
  participantIds: string[];
  lastMessage: LastMessage;
  updatedAt: string;
};

export type CreateConversationResponse = {
  createConversation: Conversation;
};
