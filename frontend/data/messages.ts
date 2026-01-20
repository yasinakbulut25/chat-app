import { Message } from "@/types/message";

export const messages: Record<string, Message[]> = {
  "2": [
    {
      id: "m1",
      userId: "2",
      text: "Selam 👋",
      isOwn: true,
    },
    {
      id: "m2",
      userId: "2",
      text: "Nasılsın?",
      isOwn: false,
    },
  ],
  "3": [
    {
      id: "m3",
      userId: "3",
      text: "Toplantı yarın",
      isOwn: false,
    },
  ],
};
