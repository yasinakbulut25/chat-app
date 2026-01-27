import { Message } from "./message";

export type User = {
  id: string;
  name: string;
  image: string;
  isOnline: boolean;
};

export type UserWithLastMessage = User & {
  lastMessage: Message | null;
};
