import ChatLayout from "@/components/layout/ChatLayout";
import Sidebar from "@/components/layout/Sidebar";

export default function Home() {
  return (
    <main className="h-dvh flex p-4 gap-4">
      <Sidebar />
      <ChatLayout />
    </main>
  );
}
