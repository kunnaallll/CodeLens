import { apiRequest } from "./api";
export const getMyProgress = () => apiRequest("/api/progress/");
export const getProgressSummary = () => apiRequest("/api/progress/summary/");
export const getMyScores = () => apiRequest("/api/scores/");
export const getLeaderboard = (period = "all") => apiRequest(`/api/progress/leaderboard/?period=${encodeURIComponent(period)}`);
export const recordAlgorithmRun = (algorithm) => apiRequest("/api/progress/record/", { method: "POST", body: JSON.stringify({ algorithm: algorithm.id }) });
