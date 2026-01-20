"use client";

import ChatLayout from "@/components/layout/ChatLayout";
import Sidebar from "@/components/layout/Sidebar";
import { users } from "@/data/users";
import { useState } from "react";

export default function Home() {
  const [selectedUser, setSelectedUser] = useState(users[0]);

  return (
    <main className="h-dvh flex p-4 gap-4">
      <Sidebar selectedUser={selectedUser} onSelectUser={setSelectedUser} />
      <ChatLayout selectedUser={selectedUser} />
    </main>
  );
}
