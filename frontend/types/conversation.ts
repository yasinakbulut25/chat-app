export type LastMessage = {
  content: string;
  createdAt: string;
} | null;

export type Conversation = {
  id: string;
  participantIds: string[];
  lastMessage: LastMessage;
};

export type CreateConversationResponse = {
  createConversation: Conversation;
};
