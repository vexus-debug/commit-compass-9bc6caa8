import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Bell, User, Settings, LogOut, ChevronDown, Command } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUnreadCount } from "@/hooks/useNotifications";
import { motion } from "framer-motion";

const breadcrumbMap: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/patients": "Patients",
  "/dashboard/appointments": "Appointments",
  "/dashboard/dental-charts": "Dental Charts",
  "/dashboard/treatments": "Treatments",
  "/dashboard/prescriptions": "Prescriptions",
  "/dashboard/billing": "Billing",
  "/dashboard/reports": "Reports",
  "/dashboard/lab-work": "Lab Work",
  "/dashboard/staff": "Staff",
  "/dashboard/inventory": "Inventory",
  "/dashboard/notifications": "Notifications",
  "/dashboard/tutorials": "Tutorials",
  "/dashboard/settings": "Settings",
  "/dashboard/profile": "My Profile",
  "/dashboard/lab": "Lab Dashboard",
  "/dashboard/lab/cases": "Lab Cases",
  "/dashboard/lab/technicians": "Technicians",
  "/dashboard/lab/billing": "Lab Billing",
  "/dashboard/lab/settings": "Lab Settings",
  "/dashboard/messages": "Messages",
};

export function DashboardHeader() {
  const { profile, user, signOut } = useAuth();
  const { data: unreadCount = 0 } = useUnreadCount();
  const navigate = useNavigate();
  const location = useLocation();

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "Staff";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const currentPage = breadcrumbMap[location.pathname] || "Dashboard";

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-border/50 bg-card/80 backdrop-blur-xl px-4 lg:px-6 shadow-sm">
      <SidebarTrigger className="-ml-1" />

      {/* Breadcrumb */}
      <div className="hidden md:flex items-center gap-1.5 text-sm">
        <span className="text-muted-foreground">Dashboard</span>
        {currentPage !== "Dashboard" && (
          <>
            <span className="text-muted-foreground/50">/</span>
            <span className="font-medium text-foreground">{currentPage}</span>
          </>
        )}
      </div>

      {/* Search */}
      <div className="relative flex-1 max-w-md ml-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search patients, appointments..."
          className="pl-9 pr-16 h-9 bg-muted/40 border-border/50 focus-visible:bg-card focus-visible:ring-1 focus-visible:ring-ring/50 rounded-lg"
        />
        <kbd className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none inline-flex h-5 items-center gap-0.5 rounded border border-border/60 bg-muted/60 px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <Command className="h-2.5 w-2.5" />K
        </kbd>
      </div>

      <div className="flex items-center gap-1.5">
        {/* Back to website */}
        <Button variant="ghost" size="sm" asChild className="hidden lg:inline-flex text-xs text-muted-foreground hover:text-foreground">
          <Link to="/">← Website</Link>
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative" asChild>
          <Link to="/dashboard/notifications">
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <motion.span
                className="absolute -top-0.5 -right-0.5 h-4 min-w-4 rounded-full bg-destructive text-[10px] text-destructive-foreground flex items-center justify-center px-0.5"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </motion.span>
            )}
          </Link>
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-accent/50">
              <Avatar className="h-7 w-7 ring-2 ring-border/50">
                <AvatarImage src={profile?.avatar_url || ""} />
                <AvatarFallback className="bg-secondary/15 text-secondary text-xs">{initials}</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline text-sm font-medium">{displayName}</span>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 backdrop-blur-xl bg-popover/95 border-border/50">
            <DropdownMenuItem onClick={() => navigate("/dashboard/profile")}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/dashboard/settings" className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
