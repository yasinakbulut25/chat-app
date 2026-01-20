import { Button } from "@heroui/react";
import { Star } from "lucide-react";
import Image from "next/image";

type Props = {
  user: {
    id: string;
    name: string;
    lastMessage: string;
    image: string;
  };
};

export default function UserListItem({ user }: Props) {
  return (
    <div className="flex items-start p-2 gap-3 hover:bg-slate-100 rounded-lg cursor-pointer duration-200">
      <Image
        src={user.image}
        alt={user.name}
        width={36}
        height={36}
        className="rounded-full object-cover min-w-9 h-9"
      />
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
