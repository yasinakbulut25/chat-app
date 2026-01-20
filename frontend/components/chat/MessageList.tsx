import { messages } from "@/data/messages";
import MessageItem from "./MessageItem";

export default function MessageList() {
  return (
    <div className="flex-1 p-4 space-y-2 overflow-y-auto">
      {messages.map((msg) => (
        <MessageItem key={msg.id} message={msg} />
      ))}
    </div>
  );
}
