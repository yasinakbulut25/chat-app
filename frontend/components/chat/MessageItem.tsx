import Image from "next/image";

type Props = {
  message: {
    id: string;
    text: string;
    isOwn: boolean;
  };
};

export default function MessageItem({ message }: Props) {
  return (
    <div
      className={`flex items-start gap-2 w-max max-w-xs min-w-10 ${message.isOwn ? "ml-auto flex-row-reverse" : ""}`}
    >
      <Image
        src="/users/user1.png"
        alt="/users/user1.png"
        width={24}
        height={24}
        className="rounded-full object-cover min-w-6 h-6"
      />
      <div
        className={`w-full px-3 py-2 text-sm rounded-xl 
          ${message.isOwn ? "bg-indigo-500 rounded-tr-none text-white" : "bg-slate-100 rounded-tl-none"}`}
      >
        {message.text}
      </div>
    </div>
  );
}
