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
      className={`max-w-xs px-4 py-2 rounded text-sm ${
        message.isOwn ? "ml-auto bg-black text-white" : "bg-white border"
      }`}
    >
      {message.text}
    </div>
  );
}
