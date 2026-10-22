import { apiRequest } from "./api";
export const listChallenges = () => apiRequest("/api/challenges/");
export const getChallenge = (idOrSlug) => apiRequest(`/api/challenges/${encodeURIComponent(idOrSlug)}/`);
export function submitChallenge(id, body) { return apiRequest(`/api/challenges/${id}/submit/`, { method: "POST", body: JSON.stringify(body) }); }
export function submitQuestionAnswer(id, answer) { return apiRequest(`/api/challenges/questions/${id}/answer/`, { method: "POST", body: JSON.stringify({ answer }) }); }
