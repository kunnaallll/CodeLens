import { apiRequest } from "./api";
export const listChallenges = () => apiRequest("/api/challenges/");
export async function getChallenge(id) {
  const challenges = await listChallenges();
  const rows = challenges?.results || challenges;
  const found = rows.find((item) => String(item.id) === String(id) || item.slug === id);
  if (!found) throw new Error("Challenge not found.");
  return found;
}
export function submitChallenge(id, body) { return apiRequest(`/api/challenges/${id}/submit/`, { method: "POST", body: JSON.stringify(body) }); }
