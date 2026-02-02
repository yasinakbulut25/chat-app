"use client";

import UserListItem from "@/components/users/UserListItem";
import { Button, Input, Spinner } from "@heroui/react";
import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useChat } from "@/providers/ChatProvider";
import { useAuth } from "@/providers/AuthContext";
import { UserWithLastMessage } from "@/types/user";

export default function Sidebar() {
  const [isSearchable, setIsSearchable] = useState(false);
  const { user } = useAuth();
  const currentUserId = user?.id;
  const { users, loading, selectedUser, messages, conversations, selectUser } =
    useChat();

  const usersWithLastMessage: UserWithLastMessage[] = useMemo(() => {
    return users.map((user) => {
      const conversation = conversations.find((c) =>
        c.participantIds.includes(user.id),
      );

      if (!conversation) {
        return { ...user, lastMessage: null };
      }

      const conversationMessages = messages.filter(
        (m) => m.conversationId === conversation.id,
      );

      if (conversationMessages.length === 0) {
        return { ...user, lastMessage: null };
      }

      const lastMsg = conversationMessages[conversationMessages.length - 1];

      return {
        ...user,
        lastMessage: {
          id: lastMsg.id,
          content: lastMsg.content,
          createdAt: lastMsg.createdAt,
          senderId: lastMsg.senderId,
          isOwn: lastMsg.senderId === currentUserId,
        },
      };
    });
  }, [users, conversations, messages, currentUserId]);

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
    </aside>
  );
}
