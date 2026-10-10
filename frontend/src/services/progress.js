import { apiRequest } from "./api";
export const getMyProgress = () => apiRequest("/api/progress/");
export const recordAlgorithmRun = (algorithm) => apiRequest("/api/progress/record/", { method: "POST", body: JSON.stringify({ algorithm: algorithm.id }) });
