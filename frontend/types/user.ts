export type User = {
  id: string;
  name: string;
  image: string;
  isOnline: boolean;
};

export type UserLastMessage = {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  isOwn: boolean;
};

export type UserWithLastMessage = User & {
  lastMessage: UserLastMessage | null;
};
