import AchievementCard from "../components/AchievementCard";
import ErrorMessage from "../components/ErrorMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import { useFetch } from "../hooks/useFetch";
import { listAchievements } from "../services/achievements";

export default function Achievements() {
  const { data, loading, error, refetch } = useFetch(listAchievements, []);
  const achievements = data?.results || data || [];
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  if (loading) return <LoadingSpinner label="Loading achievements..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">Achievements</h1>
        <p className="text-sm text-ink-500">{unlockedCount} of {achievements.length} unlocked</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {achievements.map((a) => (
          <AchievementCard key={a.code} achievement={a} />
        ))}
      </div>
    </div>
  );
}
