import { apiRequest } from "./api";

export const getAnalytics = () => apiRequest("/api/analytics/");
