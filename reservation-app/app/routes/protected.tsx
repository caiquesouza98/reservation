import apiRequest from "@/api/client";
import { useEffect, useState, type JSX } from "react";
import { Navigate, Outlet, redirect } from "react-router";



export default function ProtectedLayout({ children }: { children: JSX.Element }) {
  const [auth, setAuth] = useState<null | boolean>(null);

  useEffect(() => {
    apiRequest("/auth/check")
      .then(() => setAuth(true))
      .catch(() => setAuth(false));
  }, []);

  if (auth === null) return <p>Carregando...</p>;
  if (!auth) return <Navigate to="/" />;

  return <Outlet />;
}
