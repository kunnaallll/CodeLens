import ErrorMessage from "../../components/ErrorMessage";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useFetch } from "../../hooks/useFetch";
import { listUsers } from "../../services/auth";

export default function AdminUsers() {
  const { data, loading, error, refetch } = useFetch(listUsers, []);
  if (loading) return <LoadingSpinner label="Loading users..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  const users = data.results || data;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-ink-900">Users</h1>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-ink-50 text-left text-xs uppercase tracking-wide text-ink-500">
            <tr>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-3 font-medium text-ink-800">{u.username}</td>
                <td className="px-4 py-3 text-ink-600">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`badge ${u.role === "ADMIN" ? "bg-violet-100 text-violet-700" : "bg-ink-100 text-ink-600"}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-ink-500">{new Date(u.date_joined).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
