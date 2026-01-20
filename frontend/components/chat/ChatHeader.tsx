import Image from "next/image";

export default function ChatHeader() {
  return (
    <div className="border-b border-slate-200 flex items-center gap-2 p-4 font-medium">
      <Image
        src="/users/user1.png"
        alt="/users/user1.png"
        width={24}
        height={24}
        className="rounded-full object-cover min-w-6 h-6"
      />
      <div className="font-medium text-base text-slate-900">Ahmet</div>
    </div>
  );
}
