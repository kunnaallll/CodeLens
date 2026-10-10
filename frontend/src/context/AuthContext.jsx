import { useCallback, useEffect, useMemo, useState } from "react";
import { apiRequest, TOKEN_KEY } from "../services/api";
import { AuthContext } from "./AuthContextValue";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => Boolean(sessionStorage.getItem(TOKEN_KEY)));
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    if (!sessionStorage.getItem(TOKEN_KEY)) return undefined;
    let active = true;
    apiRequest("/api/auth/profile/").then((profile) => { if (active) setUser(profile); }).catch(() => {
      if (active) { sessionStorage.removeItem(TOKEN_KEY); setUser(null); }
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [revision]);

  useEffect(() => {
    const expireSession = () => setUser(null);
    window.addEventListener("codelens:unauthorized", expireSession);
    return () => window.removeEventListener("codelens:unauthorized", expireSession);
  }, []);

  const login = useCallback(async (username, password) => {
    const tokens = await apiRequest("/api/auth/login/", { method: "POST", body: JSON.stringify({ username, password }) });
    sessionStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
    const profile = await apiRequest("/api/auth/profile/");
    setUser(profile);
  }, []);
  const register = useCallback(async (values) => {
    const { password_confirm: ignored, ...payload } = values;
    void ignored;
    return apiRequest("/api/auth/register/", { method: "POST", body: JSON.stringify(payload) });
  }, []);
  const logout = useCallback(() => { sessionStorage.removeItem(TOKEN_KEY); setUser(null); }, []);
  const value = useMemo(() => ({ user, loading, login, register, logout, isAuthenticated: Boolean(user), isAdmin: user?.role === "admin", refreshProfile: () => setRevision((n) => n + 1) }), [user, loading, login, register, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
