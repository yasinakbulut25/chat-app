"use client";

import { Button, Input } from "@heroui/react";
import { SendHorizonalIcon, SmilePlusIcon } from "lucide-react";

export default function MessageInput() {
  return (
    <div className="h-16 border-t border-slate-200 flex items-center px-4 gap-2">
      <Button
        startContent={<SmilePlusIcon width={16} />}
        isIconOnly
        className="bg-transparent text-slate-500 w-auto p-0"
      />
      <Input
        placeholder="Type your message.."
        classNames={{
          inputWrapper:
            "bg-slate-50 pr-0 data-[hover=true]:bg-slate-100 group-data-[focus=true]:bg-slate-50 shadow-none",
        }}
      />
      <Button
        startContent={<SendHorizonalIcon width={16} />}
        isIconOnly
        className="bg-transparent text-slate-500 w-auto p-0"
      />
    </div>
  );
}
