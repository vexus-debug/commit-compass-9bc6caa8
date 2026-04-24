import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { hasPageAccess } from "@/config/roleAccess";
import { toast } from "sonner";
import { useEffect, useRef } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { session, roles, loading } = useAuth();
  const location = useLocation();
  const toastShown = useRef(false);

  const hasAccess = roles.length === 0 ? true : hasPageAccess(roles, location.pathname);

  useEffect(() => {
    if (!loading && session && !hasAccess && !toastShown.current) {
      toastShown.current = true;
      toast.error("You don't have access to that page.");
    }
  }, [loading, session, hasAccess]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-secondary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    const loginPath = location.pathname.startsWith("/lab-dashboard") ? "/lab-login" : "/login";
    return <Navigate to={loginPath} replace />;
  }

  // Lab-only users (lab_technician or lab_entry_clerk) should go to lab dashboard
  const labRoles = ["lab_manager", "lab_technician", "lab_entry_clerk"];
  const isLabOnly =
    roles.length > 0 && roles.every((r) => labRoles.includes(r));

  if (isLabOnly && location.pathname === "/dashboard") {
    return <Navigate to="/lab-dashboard" replace />;
  }

  if (!hasAccess) {
    return <Navigate to={isLabOnly ? "/lab-dashboard" : "/dashboard"} replace />;
  }

  return <>{children}</>;
}
