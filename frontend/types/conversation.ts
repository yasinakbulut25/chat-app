export type Conversation = {
  id: string;
  participantIds: string[];
  lastMessage: {
    content: string;
    createdAt: string;
  } | null;
};

export type CreateConversationResponse = {
  createConversation: Conversation;
};
