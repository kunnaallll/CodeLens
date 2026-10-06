import { Link } from "react-router-dom";

import ErrorMessage from "../../components/ErrorMessage";
import LoadingSpinner from "../../components/LoadingSpinner";
import StatCard from "../../components/StatCard";
import { BookIcon, FileIcon, TargetIcon, UsersIcon } from "../../components/icons";
import { useFetch } from "../../hooks/useFetch";
import { listAlgorithms } from "../../services/algorithms";
import { listUsers } from "../../services/auth";
import { listAllSubmissions, listChallenges } from "../../services/challenges";

const DJANGO_ADMIN_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api").replace(/\/api\/?$/, "/admin/");

export default function Admin() {
  const { data: users, loading: l1, error: e1 } = useFetch(listUsers, []);
  const { data: algorithms, loading: l2, error: e2 } = useFetch(() => listAlgorithms(), []);
  const { data: challenges, loading: l3, error: e3 } = useFetch(() => listChallenges(), []);
  const { data: submissions, loading: l4, error: e4 } = useFetch(listAllSubmissions, []);

  if (l1 || l2 || l3 || l4) return <LoadingSpinner label="Loading admin dashboard..." />;
  const error = e1 || e2 || e3 || e4;
  if (error) return <ErrorMessage message={error} />;

  const userCount = users.count ?? users.results?.length ?? users.length;
  const algoCount = algorithms.count ?? algorithms.results?.length ?? algorithms.length;
  const challengeCount = challenges.count ?? challenges.results?.length ?? challenges.length;
  const submissionCount = submissions.count ?? submissions.results?.length ?? submissions.length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Admin Panel</h1>
          <p className="text-sm text-ink-500">Manage platform content and view activity.</p>
        </div>
        <a href={DJANGO_ADMIN_URL} target="_blank" rel="noreferrer" className="btn-secondary">
          Open Django Admin ↗
        </a>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={UsersIcon} label="Users" value={userCount} accent="brand" />
        <StatCard icon={BookIcon} label="Algorithms" value={algoCount} accent="violet" />
        <StatCard icon={TargetIcon} label="Challenges" value={challengeCount} accent="amber" />
        <StatCard icon={FileIcon} label="Submissions" value={submissionCount} accent="cyan" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link to="/admin/users" className="card p-5 hover:shadow-card-hover">
          <h3 className="font-semibold text-ink-900">Users</h3>
          <p className="text-sm text-ink-500">View registered students and admins.</p>
        </Link>
        <Link to="/admin/algorithms" className="card p-5 hover:shadow-card-hover">
          <h3 className="font-semibold text-ink-900">Algorithms</h3>
          <p className="text-sm text-ink-500">Create, edit, or remove algorithm entries.</p>
        </Link>
        <Link to="/admin/challenges" className="card p-5 hover:shadow-card-hover">
          <h3 className="font-semibold text-ink-900">Challenges</h3>
          <p className="text-sm text-ink-500">Create, edit, or remove challenges.</p>
        </Link>
        <Link to="/admin/submissions" className="card p-5 hover:shadow-card-hover">
          <h3 className="font-semibold text-ink-900">Submissions</h3>
          <p className="text-sm text-ink-500">Review every challenge submission platform-wide.</p>
        </Link>
      </div>
    </div>
  );
}
