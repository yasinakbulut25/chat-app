import { User } from "@/types/user";
import Image from "next/image";

type Props = {
  user: Pick<User, "name" | "image" | "isOnline">;
};

export default function ChatHeader({ user }: Props) {
  return (
    <div className="border-b border-slate-200 flex items-center gap-2 p-4 font-medium">
      <Image
        src={user.image}
        alt={user.name}
        width={24}
        height={24}
        className="rounded-full object-cover min-w-6 h-6"
      />

      <span className="font-medium text-base text-slate-900">
        {user.name}
      </span>
      <span
        className={`flex items-center gap-1 text-xs px-2 py-1 border ${user.isOnline ? "border-green-400 bg-green-50 text-green-500" : "border-slate-400 bg-slate-50 text-slate-500"} rounded-xl`}
      >
        <span
          className={`flex min-w-2 h-2 ${user.isOnline ? "bg-green-400" : "bg-slate-400"} rounded-full`}
        ></span>
        {user.isOnline ? "Online" : "Offline"}
      </span>
    </div>
  );
}
