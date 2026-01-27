"use client";

import ChatLayout from "@/components/layout/ChatLayout";
import Sidebar from "@/components/layout/Sidebar";
import Login from "@/components/Login";
import { useAuth } from "@/providers/AuthContext";

export default function Home() {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  return (
    <main className="h-dvh flex p-4 gap-4">
      <Sidebar />
      <ChatLayout />
    </main>
  );
}
