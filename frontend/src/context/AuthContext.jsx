import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("moto_income_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api.get("/auth/me")
      .then((res) => setAdmin(res.data.admin))
      .catch(() => localStorage.removeItem("moto_income_token"))
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("moto_income_token", res.data.token);
    setAdmin(res.data.admin);
  }

  function logout() {
    localStorage.removeItem("moto_income_token");
    setAdmin(null);
  }

  const value = useMemo(() => ({ admin, loading, login, logout, setAdmin }), [admin, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
