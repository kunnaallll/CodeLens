import { apiRequest } from "./api";
const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export async function listAlgorithms() {
  const result = await apiRequest("/api/algorithms/");
  const rows = result?.results || result;
  return rows.map((algorithm) => ({ ...algorithm, slug: algorithm.slug || slugify(algorithm.name), best_case: algorithm.best_case || (algorithm.name.toLowerCase() === "bubble sort" ? "O(n)" : "—"), average_case: algorithm.average_case || algorithm.time_complexity, worst_case: algorithm.worst_case || algorithm.time_complexity, difficulty: algorithm.difficulty || "—" }));
}
export async function getAlgorithm(slug) {
  const algorithms = await listAlgorithms();
  const result = algorithms.find((item) => item.slug === slug || String(item.id) === slug);
  if (!result) throw new Error("This algorithm is not available in the backend yet.");
  return result;
}
export const createAlgorithm = (body) => apiRequest("/api/algorithms/", { method: "POST", body: JSON.stringify(body) });
export const updateAlgorithm = (id, body) => apiRequest(`/api/algorithms/${id}/`, { method: "PATCH", body: JSON.stringify(body) });
export const deleteAlgorithm = (id) => apiRequest(`/api/algorithms/${id}/`, { method: "DELETE" });
