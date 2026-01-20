export default function MessageInput() {
  return (
    <div className="h-16 border-t flex items-center px-4 gap-2">
      <input
        className="flex-1 border rounded px-3 py-2"
        placeholder="Mesaj yaz..."
      />
      <button className="bg-black text-white px-4 py-2 rounded">Gönder</button>
    </div>
  );
}
