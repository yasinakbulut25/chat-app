import { User } from "@/types/user";

export const users: User[] = [
  {
    id: "1",
    name: "Ahmet",
    conversationId: "c1",
    lastMessage: "",
    image: "/users/user1.png",
    isOnline: true,
  },
  {
    id: "2",
    name: "Mehmet",
    conversationId: "c2",
    lastMessage: "",
    image: "/users/user2.png",
    isOnline: false,
  },
  {
    id: "3",
    name: "Ayşe",
    conversationId: "c3",
    lastMessage: "",
    image: "/users/user3.png",
    isOnline: true,
  },
];
