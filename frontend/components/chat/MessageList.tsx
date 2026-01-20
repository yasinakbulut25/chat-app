import MessageItem from "./MessageItem";
import { User } from "@/types/user";
import { Message } from "@/types/message";

type Props = {
  user: Pick<User, "image" | "id">;
  messages: Message[];
};

export default function MessageList({ user, messages }: Props) {
  const filteredMessages: Message[] = messages.filter(
    (msg) => msg.userId === user.id,
  );

  if (filteredMessages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
        Henüz mesaj yok
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 space-y-2 overflow-y-auto">
      {filteredMessages.map((msg) => (
        <MessageItem key={msg.id} message={msg} image={user.image} />
      ))}
    </div>
  );
}
