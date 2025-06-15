"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      // Store the attempted path to redirect back after login
      // Not implemented here for simplicity, but common practice
      router.replace("/admin"); 
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Authenticating...</p>
      </div>
    );
  }

  if (!user && !loading) {
    // This case should ideally be handled by the redirect in useEffect,
    // but as a fallback, prevent rendering children.
    // Or, could return null and rely on useEffect to redirect.
    return null;
  }
  
  // User is authenticated
  return <>{children}</>;
}
