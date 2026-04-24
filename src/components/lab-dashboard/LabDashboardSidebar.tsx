import { useEffect } from "react";
import { NavLink } from "@/components/NavLink";
import { useSidebar } from "@/components/ui/sidebar";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard, Users, Building2, ClipboardList, Wrench,
  CreditCard, DollarSign, UserCog, Settings, LogOut, FlaskConical,
  Package, BarChart3, Bell, Shield, FileText, Receipt, Download, Activity,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { getRoleLabel, hasPageAccess } from "@/config/roleAccess";
import { motion } from "framer-motion";

const navGroups = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", url: "/lab-dashboard", icon: LayoutDashboard },
      { title: "Calendar", url: "/lab-dashboard/calendar", icon: BarChart3 },
    ],
  },
  {
    label: "Operations",
    items: [
      { title: "Cases", url: "/lab-dashboard/cases", icon: ClipboardList },
      { title: "Recurring Orders", url: "/lab-dashboard/recurring", icon: Package },
      { title: "Work Types", url: "/lab-dashboard/work-types", icon: Wrench },
      { title: "Shade Library", url: "/lab-dashboard/shades", icon: FlaskConical },
      { title: "Clients", url: "/lab-dashboard/clients", icon: Building2 },
      { title: "External Labs", url: "/lab-dashboard/external-labs", icon: Building2 },
      { title: "Lab Payments", url: "/lab-dashboard/external-lab-payments", icon: DollarSign },
    ],
  },
  {
    label: "Logistics",
    items: [
      { title: "Shipments", url: "/lab-dashboard/shipments", icon: Package },
      { title: "Dispatch", url: "/lab-dashboard/dispatch", icon: Package },
      { title: "Warranties", url: "/lab-dashboard/warranties", icon: Shield },
    ],
  },
  {
    label: "Team",
    items: [
      { title: "Staff", url: "/lab-dashboard/staff", icon: UserCog },
      { title: "Skills Matrix", url: "/lab-dashboard/skills", icon: Activity },
      { title: "Performance", url: "/lab-dashboard/performance", icon: Activity },
      { title: "Salary Allocation", url: "/lab-dashboard/salary", icon: DollarSign },
      { title: "Create Account", url: "/lab-dashboard/create-account", icon: Users },
    ],
  },
  {
    label: "Resources",
    items: [
      { title: "Inventory", url: "/lab-dashboard/inventory", icon: Package },
      { title: "Equipment", url: "/lab-dashboard/equipment", icon: Wrench },
    ],
  },
  {
    label: "Finance",
    items: [
      { title: "Invoices", url: "/lab-dashboard/invoices", icon: CreditCard },
      { title: "Payments", url: "/lab-dashboard/payments", icon: DollarSign },
      { title: "Expenses", url: "/lab-dashboard/expenses", icon: Receipt },
      { title: "Client Prices", url: "/lab-dashboard/prices", icon: DollarSign },
      { title: "Credit Notes", url: "/lab-dashboard/credit-notes", icon: FileText },
      { title: "Statements", url: "/lab-dashboard/statements", icon: Receipt },
      { title: "Analytics", url: "/lab-dashboard/analytics", icon: BarChart3 },
      { title: "Reports", url: "/lab-dashboard/reports", icon: Download },
    ],
  },
  {
    label: "System",
    items: [
      { title: "Communications", url: "/lab-dashboard/communications", icon: Bell },
      { title: "Notifications", url: "/lab-dashboard/notifications", icon: Bell },
      { title: "Audit Log", url: "/lab-dashboard/audit-log", icon: Shield },
      { title: "Lab Settings", url: "/lab-dashboard/settings", icon: Settings },
    ],
  },
];

export function LabDashboardSidebar() {
  const { state, setOpenMobile, isMobile } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, user, roles, signOut } = useAuth();

  useEffect(() => {
    if (isMobile) setOpenMobile(false);
  }, [location.pathname, isMobile, setOpenMobile]);

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "Staff";
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
  const primaryRole = roles[0] || "staff";

  const handleSignOut = async () => { await signOut(); navigate("/login"); };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-sidebar-border">
        <div className="relative shrink-0">
          <div className="h-9 w-9 rounded-xl bg-sidebar-primary/20 flex items-center justify-center ring-2 ring-sidebar-primary/30">
            <FlaskConical className="h-5 w-5 text-sidebar-primary" />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-sidebar" />
        </div>
        {!collapsed && (
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-bold text-sidebar-primary-foreground truncate tracking-tight">Impression n Teeth</span>
            <span className="text-[10px] text-sidebar-foreground/60 font-medium">Lab Management</span>
          </div>
        )}
      </div>

      <SidebarContent className="pt-2 px-2">
        {navGroups.map((group) => {
          const visibleItems = group.items.filter((item) =>
            hasPageAccess(roles, item.url)
          );
          if (visibleItems.length === 0) return null;
          return (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.15em] text-sidebar-foreground/40 font-semibold px-2 mb-0.5">
                {group.label}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {visibleItems.map((item) => {
                    const active = location.pathname === item.url;
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                          <NavLink
                            to={item.url}
                            className="relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 hover:bg-sidebar-accent group"
                            activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                          >
                            {active && (
                              <motion.div
                                layoutId="lab-sidebar-active-pill"
                                className="absolute inset-0 rounded-lg bg-sidebar-primary/10 border border-sidebar-primary/20"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                              />
                            )}
                            <item.icon className={`h-4 w-4 shrink-0 relative z-10 transition-transform duration-200 group-hover:scale-110 ${active ? "text-sidebar-primary" : "text-sidebar-foreground/70"}`} />
                            <span className="relative z-10">{item.title}</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/lab-dashboard")} className="shrink-0 group">
            <Avatar className="h-8 w-8 ring-2 ring-sidebar-primary/20">
              <AvatarImage src={profile?.avatar_url || ""} />
              <AvatarFallback className="bg-gradient-to-br from-sidebar-primary/30 to-sidebar-primary/10 text-sidebar-primary text-xs font-semibold">{initials}</AvatarFallback>
            </Avatar>
          </button>
          {!collapsed && (
            <div className="flex flex-col overflow-hidden flex-1">
              <span className="text-sm font-medium truncate text-sidebar-primary-foreground">{displayName}</span>
              <Badge variant="outline" className="w-fit text-[10px] px-1.5 py-0 mt-0.5 border-sidebar-primary/30 text-sidebar-primary/80">
                {getRoleLabel(primaryRole)}
              </Badge>
            </div>
          )}
          {!collapsed && (
            <button onClick={handleSignOut} className="text-muted-foreground hover:text-destructive transition-colors p-1.5 rounded-md hover:bg-destructive/10" title="Sign out">
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
