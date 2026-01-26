import ChatLayout from "@/components/layout/ChatLayout";
import Sidebar from "@/components/layout/Sidebar";
import { ChatProvider } from "@/providers/ChatProvider";

export default function Home() {
  return (
    <ChatProvider>
      <main className="h-dvh flex p-4 gap-4">
        <Sidebar />
        <ChatLayout />
      </main>
    </ChatProvider>
  );
}
