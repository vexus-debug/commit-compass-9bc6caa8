import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Users, CalendarDays, CreditCard, TrendingUp, UserPlus, CalendarPlus, FileText, Clock, Activity,
  ArrowUpRight, ArrowDownRight, Sparkles,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, Line, LineChart } from "recharts";
import {
  useDashboardStats, useWeeklyAppointments, useRevenueData, useTodaySchedule, useRecentActivity, useCurrentUserName,
} from "@/hooks/useDashboardData";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { hasPageAccess } from "@/config/roleAccess";
import { AnimatedCounter } from "@/components/dashboard/AnimatedCounter";
import type { Easing } from "framer-motion";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const statusColors: Record<string, string> = {
  scheduled: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  "in-progress": "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  completed: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  cancelled: "bg-red-500/10 text-red-700 dark:text-red-400",
};

const statusDots: Record<string, string> = {
  scheduled: "bg-blue-500",
  "in-progress": "bg-amber-500",
  completed: "bg-emerald-500",
  cancelled: "bg-red-500",
};

const activityColors: Record<string, string> = {
  appointment: "bg-blue-500/10 text-blue-600",
  payment: "bg-emerald-500/10 text-emerald-600",
  patient: "bg-violet-500/10 text-violet-600",
  lab: "bg-amber-500/10 text-amber-600",
  prescription: "bg-rose-500/10 text-rose-600",
};

const activityIcons: Record<string, typeof Activity> = {
  appointment: CalendarDays,
  payment: CreditCard,
  patient: Users,
  lab: FileText,
  prescription: FileText,
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(amount);
}

// Mini sparkline data for stat cards
const sparkData = {
  patients: [{ v: 40 }, { v: 55 }, { v: 48 }, { v: 62 }, { v: 58 }, { v: 72 }, { v: 80 }],
  appointments: [{ v: 12 }, { v: 18 }, { v: 14 }, { v: 22 }, { v: 16 }, { v: 20 }, { v: 18 }],
  payments: [{ v: 38 }, { v: 32 }, { v: 35 }, { v: 30 }, { v: 28 }, { v: 32 }, { v: 32 }],
  revenue: [{ v: 3.2 }, { v: 3.8 }, { v: 4.1 }, { v: 3.6 }, { v: 4.5 }, { v: 4.85 }],
};

function MiniSparkline({ data, color, height = 32 }: { data: { v: number }[]; color: string; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } },
  item: { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const } } },
};

export default function DashboardHome() {
  const { data: stats } = useDashboardStats();
  const { data: weeklyData } = useWeeklyAppointments();
  const { data: revenueData } = useRevenueData();
  const { data: todayAppointments } = useTodaySchedule();
  const { data: activities } = useRecentActivity();
  const { data: userName } = useCurrentUserName();
  const { roles } = useAuth();

  const s = stats || { totalPatients: 0, todayAppointments: 0, pendingPayments: 0, monthlyRevenue: 0 };
  const schedule = todayAppointments || [];
  const recentActivities = activities || [];
  const currentMonth = format(new Date(), "MMM");

  const canSeePatients = hasPageAccess(roles, "/dashboard/patients");
  const canSeeBilling = hasPageAccess(roles, "/dashboard/billing");
  const canSeeAppointments = hasPageAccess(roles, "/dashboard/appointments");

  const quickActions = [
    canSeePatients && { to: "/dashboard/patients", icon: UserPlus, title: "Register Patient", desc: "Add a new patient record", gradient: "from-blue-500/10 to-blue-600/5" },
    canSeeAppointments && { to: "/dashboard/appointments", icon: CalendarPlus, title: "Book Appointment", desc: "Schedule a visit", gradient: "from-emerald-500/10 to-emerald-600/5" },
    canSeeBilling && { to: "/dashboard/billing", icon: FileText, title: "Create Invoice", desc: "Generate a bill", gradient: "from-violet-500/10 to-violet-600/5" },
  ].filter(Boolean) as { to: string; icon: typeof UserPlus; title: string; desc: string; gradient: string }[];

  const statCards = [
    canSeePatients && {
      label: "Total Patients", value: s.totalPatients, icon: Users,
      trend: "+12%", trendUp: true, color: "#3b82f6", bgColor: "from-blue-500/10 to-blue-600/5",
      iconBg: "bg-blue-500/10", iconColor: "text-blue-600", spark: sparkData.patients,
    },
    canSeeAppointments && {
      label: "Today's Appointments", value: s.todayAppointments, icon: CalendarDays,
      trend: `${schedule.filter((a) => a.status === "completed").length} done`, trendUp: true,
      color: "#10b981", bgColor: "from-emerald-500/10 to-emerald-600/5",
      iconBg: "bg-emerald-500/10", iconColor: "text-emerald-600", spark: sparkData.appointments,
    },
    canSeeBilling && {
      label: "Pending Payments", value: s.pendingPayments, icon: CreditCard,
      trend: "-5%", trendUp: false, color: "#f59e0b", bgColor: "from-amber-500/10 to-amber-600/5",
      iconBg: "bg-amber-500/10", iconColor: "text-amber-600", spark: sparkData.payments,
    },
    canSeeBilling && {
      label: `Revenue (${currentMonth})`, value: s.monthlyRevenue, icon: TrendingUp,
      formatter: formatCurrency, trend: "+8.2%", trendUp: true,
      color: "#8b5cf6", bgColor: "from-violet-500/10 to-violet-600/5",
      iconBg: "bg-violet-500/10", iconColor: "text-violet-600", spark: sparkData.revenue,
    },
  ].filter(Boolean) as any[];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Welcome back, {userName || "Doctor"} <span className="inline-block animate-bounce-subtle">👋</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Here's what's happening at your clinic today.
          </p>
        </div>
        <div className="flex gap-2">
          {canSeePatients && (
            <Button size="sm" variant="outline" asChild className="border-border/50 hover:bg-accent/50">
              <Link to="/dashboard/patients"><UserPlus className="mr-2 h-4 w-4" />New Patient</Link>
            </Button>
          )}
          {canSeeAppointments && (
            <Button size="sm" className="bg-secondary hover:bg-secondary/90 shadow-lg shadow-secondary/20" asChild>
              <Link to="/dashboard/appointments"><CalendarPlus className="mr-2 h-4 w-4" />Book Appointment</Link>
            </Button>
          )}
        </div>
      </div>

      {/* Stat Cards */}
      <motion.div
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        variants={stagger.container}
        initial="hidden"
        animate="visible"
      >
        {statCards.map((card: any, i: number) => (
          <motion.div key={i} variants={stagger.item}>
            <Card className="stat-card glass-card">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className={`h-10 w-10 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                    <card.icon className={`h-5 w-5 ${card.iconColor}`} />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${card.trendUp ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "bg-red-500/10 text-red-700 dark:text-red-400"}`}>
                    {card.trendUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {card.trend}
                  </div>
                </div>
                <p className="text-xs font-medium text-muted-foreground mb-1">{card.label}</p>
                <p className="text-2xl font-bold tracking-tight">
                  <AnimatedCounter value={card.value} formatter={card.formatter} />
                </p>
                <div className="mt-3 -mx-1 opacity-50">
                  <MiniSparkline data={card.spark} color={card.color} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Row */}
      {(canSeeAppointments || canSeeBilling) && (
        <motion.div
          className="grid gap-4 lg:grid-cols-2"
          variants={stagger.container}
          initial="hidden"
          animate="visible"
        >
          {canSeeAppointments && (
            <motion.div variants={stagger.item}>
              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">Weekly Appointments</CardTitle>
                      <CardDescription>Appointment trends this week</CardDescription>
                    </div>
                    <div className="flex gap-1">
                      {["7D", "30D"].map((label) => (
                        <button key={label} className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${label === "7D" ? "bg-secondary/10 text-secondary" : "text-muted-foreground hover:bg-muted"}`}>
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={weeklyData || []}>
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(var(--secondary))" stopOpacity={0.9} />
                          <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity={0.4} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" vertical={false} />
                      <XAxis dataKey="day" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border) / 0.5)",
                          borderRadius: "12px",
                          fontSize: "12px",
                          boxShadow: "0 8px 24px -4px hsl(var(--foreground) / 0.1)",
                          backdropFilter: "blur(8px)",
                        }}
                      />
                      <Bar dataKey="count" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          )}
          {canSeeBilling && (
            <motion.div variants={stagger.item}>
              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">Revenue Overview</CardTitle>
                      <CardDescription>Monthly revenue trend (₦)</CardDescription>
                    </div>
                    <div className="flex gap-1">
                      {["6M", "1Y"].map((label) => (
                        <button key={label} className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${label === "6M" ? "bg-secondary/10 text-secondary" : "text-muted-foreground hover:bg-muted"}`}>
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={revenueData || []}>
                      <defs>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(var(--secondary))" stopOpacity={0.2} />
                          <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" vertical={false} />
                      <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border) / 0.5)",
                          borderRadius: "12px",
                          fontSize: "12px",
                          boxShadow: "0 8px 24px -4px hsl(var(--foreground) / 0.1)",
                        }}
                        formatter={(value: number) => [formatCurrency(value), "Revenue"]}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="hsl(var(--secondary))" fill="url(#areaGradient)" strokeWidth={2.5} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Schedule + Activity Row */}
      <div className="grid gap-4 lg:grid-cols-3">
        {canSeeAppointments && (
          <Card className="lg:col-span-2 glass-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Today's Schedule</CardTitle>
                  <CardDescription>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {schedule.filter((a) => a.status === "completed").length} completed
                    </span>
                    <span className="mx-2 text-border">·</span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      {schedule.filter((a) => a.status === "in-progress").length} in progress
                    </span>
                    <span className="mx-2 text-border">·</span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      {schedule.filter((a) => a.status === "scheduled").length} upcoming
                    </span>
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild className="text-secondary hover:text-secondary">
                  <Link to="/dashboard/appointments">View All →</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="py-2.5 px-4 text-left font-medium text-muted-foreground text-xs">Time</th>
                      <th className="py-2.5 px-4 text-left font-medium text-muted-foreground text-xs">Patient</th>
                      <th className="py-2.5 px-4 text-left font-medium text-muted-foreground text-xs hidden md:table-cell">Dentist</th>
                      <th className="py-2.5 px-4 text-left font-medium text-muted-foreground text-xs hidden lg:table-cell">Chair</th>
                      <th className="py-2.5 px-4 text-left font-medium text-muted-foreground text-xs">Treatment</th>
                      <th className="py-2.5 px-4 text-left font-medium text-muted-foreground text-xs">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedule.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                              <CalendarDays className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <p className="text-sm font-medium text-muted-foreground">No appointments today</p>
                            <Button variant="outline" size="sm" asChild>
                              <Link to="/dashboard/appointments">Schedule one</Link>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ) : schedule.map((apt) => {
                      const patientInitials = apt.patientName.split(" ").map((n: string) => n[0]).join("").slice(0, 2);
                      return (
                        <tr key={apt.id} className="border-b last:border-0 hover:bg-accent/30 transition-colors group">
                          <td className="py-3 px-4 font-medium">
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              {apt.time}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <Avatar className="h-7 w-7">
                                <AvatarFallback className="bg-secondary/10 text-secondary text-[10px] font-semibold">{patientInitials}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{apt.patientName}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 hidden md:table-cell text-muted-foreground">{apt.dentist}</td>
                          <td className="py-3 px-4 hidden lg:table-cell text-muted-foreground">{apt.chair}</td>
                          <td className="py-3 px-4 text-muted-foreground">{apt.treatment}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${statusColors[apt.status] || ""}`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${statusDots[apt.status] || ""}`} />
                              {apt.status.replace("-", " ")}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Activity Feed - Timeline Style */}
        <Card className={`glass-card ${canSeeAppointments ? "" : "lg:col-span-3"}`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Recent Activity</CardTitle>
              <Sparkles className="h-4 w-4 text-secondary/50" />
            </div>
            <CardDescription>Latest clinic updates</CardDescription>
          </CardHeader>
          <CardContent className="px-4">
            <div className="space-y-1">
              {recentActivities.length === 0 ? (
                <div className="text-center py-8">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-2">
                    <Activity className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">No recent activity</p>
                </div>
              ) : recentActivities.map((activity) => {
                const Icon = activityIcons[activity.event_type] || Activity;
                const colorClass = activityColors[activity.event_type] || "bg-muted text-muted-foreground";
                return (
                  <div key={activity.id} className="timeline-item flex gap-3 pb-4">
                    <div className={`h-8 w-8 rounded-full ${colorClass} flex items-center justify-center shrink-0 mt-0.5 ring-2 ring-card`}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-tight">{activity.description}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {format(new Date(activity.created_at), "MMM d, h:mm a")}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      {quickActions.length > 0 && (
        <motion.div
          className="grid gap-3 sm:grid-cols-3"
          variants={stagger.container}
          initial="hidden"
          animate="visible"
        >
          {quickActions.map((action, i) => (
            <motion.div key={action.to} variants={stagger.item}>
              <Link to={action.to}>
                <Card className="glass-card hover:border-secondary/30 hover:shadow-lg hover:shadow-secondary/5 transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <action.icon className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold group-hover:text-secondary transition-colors">{action.title}</p>
                      <p className="text-xs text-muted-foreground">{action.desc}</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground/0 group-hover:text-muted-foreground ml-auto transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
