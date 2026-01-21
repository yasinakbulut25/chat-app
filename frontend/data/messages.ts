import { Message } from "@/types/message";

export const messages: Record<string, Message[]> = {
  c1: [
    {
      id: "m1",
      conversationId: "c1",
      text: "Selam 👋",
      isOwn: true,
    },
    {
      id: "m2",
      conversationId: "c1",
      text: "Nasılsın?",
      isOwn: false,
    },
  ],
  c2: [
    {
      id: "m3",
      conversationId: "c2",
      text: "Toplantı yarın",
      isOwn: false,
    },
  ],
  c3: [
    {
      id: "m4",
      conversationId: "c3",
      text: "Baksana artik mesaja",
      isOwn: false,
    },
  ],
};
