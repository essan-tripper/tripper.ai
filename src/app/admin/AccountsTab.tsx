type NoOrderUser = {
  id: string;
  name: string | null;
  email: string | null;
  createdAt: Date | null;
};

export default function AccountsTab({ users }: { users: NoOrderUser[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-white/80">
        <thead>
          <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-white/40">
            <th className="pb-3 pr-4">Name</th>
            <th className="pb-3 pr-4">Email</th>
            <th className="pb-3">Registered</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
              <td className="py-3 pr-4 text-white/80">{u.name || "—"}</td>
              <td className="py-3 pr-4 text-white/60 text-xs">{u.email || "—"}</td>
              <td className="py-3 text-xs text-white/50">
                {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan={3} className="py-12 text-center text-white/40">Every user has placed an order</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
