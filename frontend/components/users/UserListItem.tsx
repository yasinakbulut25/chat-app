import { User } from "@/types/user";
import { Button } from "@heroui/react";
import { Star } from "lucide-react";
import Image from "next/image";

type Props = {
  user: User;
  isActive: boolean;
  onClick: () => void;
};

export default function UserListItem({ user, isActive, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className={`flex items-start p-2 gap-3 ${isActive ? "bg-slate-50" : "bg-transparent"} hover:bg-slate-100 rounded-lg cursor-pointer duration-200`}
    >
      <div className="relative">
        <Image
          src={user.image}
          alt={user.name}
          width={36}
          height={36}
          className="rounded-full object-cover min-w-9 h-9"
        />
        <span
          className={`absolute bottom-0 right-0 w-3 h-3 ${user.isOnline ? "bg-green-500" : "bg-slate-300"} border-2 border-white rounded-full`}
        />
      </div>

      <div className="w-full flex flex-col">
        <div className="flex items-center justify-between gap-1">
          <div className="font-medium text-base text-slate-900">
            {user.name}
          </div>
          <div className="flex items-center">
            <Button
              startContent={<Star width={16} />}
              isIconOnly
              className="bg-transparent text-slate-500 min-w-5 w-max px-1 h-auto"
            />
          </div>
        </div>

        <div className="text-sm text-slate-500 truncate">
          {user.lastMessage}
        </div>
      </div>
    </div>
  );
}
