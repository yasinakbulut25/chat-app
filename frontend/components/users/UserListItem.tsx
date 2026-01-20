type Props = {
  user: {
    id: string;
    name: string;
    lastMessage: string;
  };
};

export default function UserListItem({ user }: Props) {
  return (
    <div className="px-4 py-3 cursor-pointer hover:bg-gray-100 border-b">
      <div className="font-medium">{user.name}</div>
      <div className="text-sm text-gray-500 truncate">{user.lastMessage}</div>
    </div>
  );
}
