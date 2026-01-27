"use client";

import UserListItem from "@/components/users/UserListItem";
import { Button, Input, Spinner } from "@heroui/react";
import { Search, X } from "lucide-react";
import { useState } from "react";
import { useChat } from "@/providers/ChatProvider";

export default function Sidebar() {
  const [isSearchable, setIsSearchable] = useState(false);
  const { users, loading, selectedUser, selectUser } = useChat();

  return (
    <aside className="w-80 h-full bg-white rounded-xl overflow-x-hidden">
      <div className="flex items-center gap-2 justify-between px-4 py-2 border-b border-slate-200">
        {!isSearchable ? (
          <>
            <h3 className="font-semibold text-base text-slate-900">Messages</h3>
            <Button
              startContent={<Search width={20} />}
              isIconOnly
              className="bg-transparent text-slate-500"
              onPress={() => setIsSearchable((prev) => !prev)}
            />
          </>
        ) : (
          <Input
            autoFocus
            endContent={
              <Button
                startContent={<X width={20} />}
                isIconOnly
                className="bg-transparent text-slate-500 w-auto p-0"
                onPress={() => setIsSearchable((prev) => !prev)}
              />
            }
            placeholder="Search"
            classNames={{
              inputWrapper:
                "bg-slate-100 pr-0 data-[hover=true]:bg-slate-200 group-data-[focus=true]:bg-slate-100",
            }}
          />
        )}
      </div>

      <div className="flex flex-col gap-1 py-3 px-4">
        {loading ? (
          <Spinner
            size="md"
            variant="gradient"
            className="my-2"
            color="default"
          />
        ) : (
          users.map((user) => (
            <UserListItem
              key={user.id}
              user={user}
              isActive={user.id === selectedUser?.id}
              onClick={() => selectUser(user)}
            />
          ))
        )}
      </div>
    </aside>
  );
}
