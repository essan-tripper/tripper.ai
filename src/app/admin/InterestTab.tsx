type InterestEmail = {
  id: string;
  email: string;
  createdAt: Date | null;
};

export default function InterestTab({ emails }: { emails: InterestEmail[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-white/80">
        <thead>
          <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-white/40">
            <th className="pb-3 pr-4">Email</th>
            <th className="pb-3">Signed Up</th>
          </tr>
        </thead>
        <tbody>
          {emails.map((entry) => (
            <tr key={entry.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
              <td className="py-3 pr-4 text-white/80">{entry.email}</td>
              <td className="py-3 text-xs text-white/50">
                {entry.createdAt ? new Date(entry.createdAt).toLocaleDateString() : "—"}
              </td>
            </tr>
          ))}
          {emails.length === 0 && (
            <tr>
              <td colSpan={2} className="py-12 text-center text-white/40">No one has shown interest yet</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
