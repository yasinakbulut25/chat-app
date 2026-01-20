import MessageItem from "./MessageItem";
import { User } from "@/types/user";
import { Message } from "@/types/message";
import { useEffect, useRef } from "react";

type Props = {
  user: Pick<User, "image" | "id">;
  messages: Message[];
};

export default function MessageList({ user, messages }: Props) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
        Henüz mesaj yok
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 space-y-2 overflow-y-auto">
      {messages.map((msg) => (
        <MessageItem key={msg.id} message={msg} image={user.image} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
