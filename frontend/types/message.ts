export type MessageDTO = {
  id: string;
  conversationId: string;
  content: string;
  senderId: string;
  createdAt: string;
};

export type Message = MessageDTO & {
  isOwn: boolean;
};
