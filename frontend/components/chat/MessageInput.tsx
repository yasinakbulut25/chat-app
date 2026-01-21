"use client";

import { Button, Textarea } from "@heroui/react";
import { SendHorizonalIcon, SmilePlusIcon } from "lucide-react";
import { useState } from "react";

type Props = {
  onSend: (text: string) => void;
};

export default function MessageInput({ onSend }: Props) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-auto border-t border-slate-200 flex items-center px-4 py-2 gap-2">
      <Button
        startContent={<SmilePlusIcon width={16} />}
        isIconOnly
        className="bg-transparent text-slate-500 w-auto p-0"
      />
      <Textarea
        value={text}
        minRows={1}
        maxRows={5}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message.."
        maxLength={1000}
        classNames={{
          inputWrapper:
            "bg-slate-50 pr-0 data-[hover=true]:bg-slate-100 group-data-[focus=true]:bg-slate-50 shadow-none",
        }}
      />
      <Button
        onPress={handleSend}
        startContent={<SendHorizonalIcon width={16} />}
        isIconOnly
        className="bg-transparent text-slate-500 w-auto p-0"
      />
    </div>
  );
}
