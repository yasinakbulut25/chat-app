import { User } from "@/types/user";

export const users: User[] = [
  {
    id: "1",
    name: "Ahmet",
    lastMessage: "Nasılsın?",
    image: "/users/user1.png",
    isOnline: true,
  },
  {
    id: "2",
    name: "Mehmet",
    lastMessage: "Yarın konuşalım",
    image: "/users/user2.png",
    isOnline: false,
  },
  {
    id: "3",
    name: "Ayşe",
    lastMessage: "Tamam 👍",
    image: "/users/user3.png",
    isOnline: true,
  },
];
