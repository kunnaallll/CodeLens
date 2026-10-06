import { useState } from "react";

import Button from "../components/Button";
import ErrorMessage from "../components/ErrorMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import StatCard from "../components/StatCard";
import { BookIcon, FlameIcon, StarIcon, TargetIcon } from "../components/icons";
import { useAuth } from "../hooks/useAuth";
import { useFetch } from "../hooks/useFetch";
import { useToast } from "../hooks/useToast";
import { extractErrorMessage } from "../services/api";
import { updateProfile } from "../services/auth";
import { getMyProgress } from "../services/progress";

export default function Profile() {
  const { user, refreshProfile } = useAuth();
  const toast = useToast();
  const { data: progress, loading, error, refetch } = useFetch(getMyProgress, []);
  const [bio, setBio] = useState(user?.bio || "");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await updateProfile({ bio });
      await refreshProfile();
      toast.success("Profile updated.");
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <LoadingSpinner label="Loading profile..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  return (
    <div className="flex flex-col gap-6">
      <div className="card flex items-center gap-4 p-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-2xl font-bold text-brand-700">
          {user.username[0]?.toUpperCase()}
        </div>
        <div>
          <h1 className="text-xl font-bold text-ink-900">{user.username}</h1>
          <p className="text-sm text-ink-500">{user.email}</p>
          <div className="mt-1 flex items-center gap-2 text-xs text-ink-400">
            <span className="badge bg-ink-100 text-ink-600">{user.role}</span>
            <span>Joined {new Date(user.date_joined).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={BookIcon} label="Algorithms" value={progress.algorithms_completed} accent="brand" />
        <StatCard icon={TargetIcon} label="Challenges" value={progress.challenges_completed} accent="violet" />
        <StatCard icon={StarIcon} label="Total Score" value={progress.total_score} accent="amber" />
        <StatCard icon={FlameIcon} label="Streak" value={`${progress.current_streak}d`} accent="rose" />
      </div>

      <div className="card p-5">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-500">About</h3>
        <textarea
          className="input min-h-[90px]"
          maxLength={280}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell others a little about yourself..."
        />
        <Button onClick={handleSave} loading={saving} className="mt-3">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
