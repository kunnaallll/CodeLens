const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const TOKEN_KEY = "codelens.auth";

export function extractErrorMessage(error) {
  if (error?.message) return error.message;
  const data = error?.data;
  if (typeof data === "string") return data;
  if (data && typeof data === "object") return Object.values(data).flat().join(" ");
  return "The request failed. Please try again.";
}

export async function apiRequest(path, options = {}) {
  let tokens;
  try { tokens = JSON.parse(sessionStorage.getItem(TOKEN_KEY)); } catch { tokens = null; }
  const send = (access) => fetch(`${API_URL}${path}`, {
    ...options,
    headers: { ...(options.body ? { "Content-Type": "application/json" } : {}), ...(access ? { Authorization: `Bearer ${access}` } : {}), ...options.headers },
  });
  let response;
  try {
    response = await send(tokens?.access);
  } catch (error) {
    // Keep connection failures distinct from invalid credentials so local
    // setup problems are actionable from the sign-in screen.
    if (error instanceof TypeError) {
      throw new Error(`Cannot reach the CodeLens API at ${API_URL}. Start the Django server and try again.`, { cause: error });
    }
    throw error;
  }
  if (response.status === 401 && tokens?.refresh && !path.includes("token/refresh")) {
    const refreshed = await fetch(`${API_URL}/api/auth/token/refresh/`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ refresh: tokens.refresh }) });
    if (refreshed.ok) {
      tokens = { ...tokens, ...await refreshed.json() };
      sessionStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
      response = await send(tokens.access);
    } else {
      sessionStorage.removeItem(TOKEN_KEY);
      window.dispatchEvent(new Event("codelens:unauthorized"));
    }
  }
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(extractErrorMessage({ data: payload }) || `Request failed (${response.status}).`);
    error.status = response.status;
    throw error;
  }
  return payload;
}

export function revokeRefreshToken(refresh) {
  return fetch(`${API_URL}/api/auth/logout/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });
}

export { TOKEN_KEY };
