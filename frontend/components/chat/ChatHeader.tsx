import { User } from "@/types/user";
import Image from "next/image";

type Props = {
  user: Pick<User, "name" | "image">;
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
      <div className="font-medium text-base text-slate-900 capitalize">
        {user.name}
      </div>
    </div>
  );
}
