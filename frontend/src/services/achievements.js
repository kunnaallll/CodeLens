import { apiRequest } from "./api";

export const listAchievements = () => apiRequest("/api/achievements/");
