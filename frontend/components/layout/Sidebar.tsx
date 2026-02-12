"use client";

import UserListItem from "@/components/users/UserListItem";
import { Button, Input, Spinner } from "@heroui/react";
import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useChat } from "@/providers/ChatProvider";
import { useAuth } from "@/providers/AuthContext";
import Image from "next/image";

export default function Sidebar() {
  const [isSearchable, setIsSearchable] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const { user } = useAuth();
  const currentUserId = user?.id;
  const { users, loading, selectedUser, conversations, selectUser } = useChat();

  const usersWithLastMessage = useMemo(() => {
    return users
      .map((user) => {
        const conversation = conversations.find((c) =>
          c.participantIds.includes(user.id),
        );

        if (!conversation || !conversation.lastMessage) {
          return { ...user, lastMessage: null };
        }

        const lastMsg = conversation.lastMessage;

        return {
          ...user,
          lastMessage: {
            ...lastMsg,
            isOwn: lastMsg.senderId === currentUserId,
          },
        };
      })
      .filter((user) =>
        user.name.toLowerCase().includes(searchValue.toLowerCase()),
      );
  }, [users, conversations, currentUserId, searchValue]);

  return (
    <aside className="relative w-80 h-full flex flex-col bg-white rounded-xl overflow-hidden">
      <div className="sticky top-0 bg-white flex items-center gap-2 justify-between px-4 py-2 border-b border-slate-200 z-40">
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
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search"
            classNames={{
              inputWrapper:
                "bg-slate-100 pr-0 data-[hover=true]:bg-slate-200 group-data-[focus=true]:bg-slate-100",
            }}
          />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 py-3 px-4 overflow-auto">
        {loading ? (
          <Spinner
            size="md"
            variant="gradient"
            className="my-2"
            color="default"
          />
        ) : (
          usersWithLastMessage.map((user) => (
            <UserListItem
              key={user.id}
              user={user}
              isActive={user.id === selectedUser?.id}
              onClick={() => selectUser(user)}
            />
          ))
        )}
      </div>
      {user && (
        <div className="sticky bottom-0 left-0 border-t border-slate-200 bg-white pl-6 pr-3 py-3 z-50">
          <div className="flex items-center gap-3">
            <Image
              src={user.image}
              alt={user.name}
              width={36}
              height={36}
              className="rounded-full object-cover min-w-9 h-9"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-base text-slate-900 truncate">
                {user.name}
              </p>
              <p className="text-xs text-slate-500">You</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
