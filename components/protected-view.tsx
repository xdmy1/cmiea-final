"use client";
import { sitePath } from "@/lib/site-path";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "./auth-provider";

export function ProtectedView({
  admin = false,
  children,
}: {
  admin?: boolean;
  children: ReactNode;
}) {
  const { user, loading, isAdmin } = useAuth();
  useEffect(() => {
    if (loading) return;
    if (!user) location.replace(sitePath("/login/"));
    else if (admin && !isAdmin) location.replace(sitePath("/unauthorized/"));
  }, [loading, user, admin, isAdmin]);
  if (loading || !user || (admin && !isAdmin))
    return (
      <main className="app-container protected-loading" role="status">
        Se verifică accesul…
      </main>
    );
  return children;
}
