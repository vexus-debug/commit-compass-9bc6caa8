import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ClipboardList, Clock, AlertTriangle, CheckCircle2, Truck, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, Zap, Building2, Users,
} from "lucide-react";
import { useLdDashboardStats, useLdCases, useLdInvoices } from "@/hooks/useLabDashboard";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

const fmt = (v: number) => `₦${v.toLocaleString()}`;

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } },
  item: { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } },
};

const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function LdHomePage() {
  const { data: stats, isLoading } = useLdDashboardStats();
  const { data: cases = [] } = useLdCases();
  const { data: invoices = [] } = useLdInvoices();

  const totalRevenue = invoices.reduce((s: number, i: any) => s + Number(i.total_amount), 0);
  const totalPaid = invoices.reduce((s: number, i: any) => s + Number(i.amount_paid), 0);
  const outstanding = Math.max(totalRevenue - totalPaid, 0);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthRevenue = invoices
    .filter((i: any) => new Date(i.invoice_date) >= startOfMonth)
    .reduce((s: number, i: any) => s + Number(i.total_amount), 0);

  const paidPercentage = totalRevenue > 0 ? Math.round((totalPaid / totalRevenue) * 100) : 0;

  const totalCases = cases.length;
  const deliveredCases = cases.filter((c: any) => c.status === "delivered").length;
  const completionRate = totalCases > 0 ? Math.round((deliveredCases / totalCases) * 100) : 0;

  const urgentCases = cases
    .filter((c: any) => c.is_urgent && !["delivered"].includes(c.status))
    .slice(0, 5);

  const overdueCases = cases
    .filter((c: any) => c.due_date && new Date(c.due_date) < now && !["delivered", "ready"].includes(c.status))
    .slice(0, 5);

  const upcomingDue = cases
    .filter((c: any) => c.due_date && new Date(c.due_date) >= now && !["delivered"].includes(c.status))
    .sort((a: any, b: any) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-secondary border-t-transparent" />
      </div>
    );
  }

  const primaryStats = [
    { title: "Total Cases", value: stats?.totalCases ?? 0, icon: ClipboardList, gradient: "from-primary/20 to-primary/5", iconColor: "text-primary", borderColor: "border-primary/20" },
    { title: "In Progress", value: stats?.inProgressCases ?? 0, icon: TrendingUp, gradient: "from-blue-500/20 to-blue-500/5", iconColor: "text-blue-500", borderColor: "border-blue-500/20" },
    { title: "Ready", value: stats?.readyCases ?? 0, icon: CheckCircle2, gradient: "from-emerald-500/20 to-emerald-500/5", iconColor: "text-emerald-500", borderColor: "border-emerald-500/20" },
    { title: "Urgent", value: stats?.urgentCases ?? 0, icon: AlertTriangle, gradient: "from-destructive/20 to-destructive/5", iconColor: "text-destructive", borderColor: "border-destructive/20", pulse: (stats?.urgentCases ?? 0) > 0 },
  ];

  const secondaryStats = [
    { title: "Pending", value: stats?.pendingCases ?? 0, icon: Clock, color: "text-amber-500" },
    { title: "Delivered", value: deliveredCases, icon: Truck, color: "text-muted-foreground" },
    { title: "Active Clients", value: stats?.activeClients ?? 0, icon: Building2, color: "text-purple-500" },
    { title: "Active Staff", value: stats?.activeStaff ?? 0, icon: Users, color: "text-indigo-500" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div variants={fadeIn} initial="hidden" animate="visible">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Impression n Teeth</h1>
            <p className="text-sm text-muted-foreground mt-1">Real-time overview of lab operations & financials</p>
          </div>
          <Badge variant="outline" className="gap-1.5 px-3 py-1.5 text-xs font-medium border-secondary/30 text-secondary">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </Badge>
        </div>
      </motion.div>

      {/* Primary Stats */}
      <motion.div className="grid gap-4 grid-cols-2 lg:grid-cols-4" variants={stagger.container} initial="hidden" animate="visible">
        {primaryStats.map((stat) => (
          <motion.div key={stat.title} variants={stagger.item}>
            <Card className={`relative overflow-hidden border ${stat.borderColor} hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-60`} />
              <CardContent className="relative p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.title}</p>
                    <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                  </div>
                  <div className={`h-10 w-10 rounded-xl bg-background/80 backdrop-blur-sm flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300 ${stat.pulse ? "animate-pulse" : ""}`}>
                    <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Financial Overview + Completion Rate */}
      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div className="lg:col-span-2" variants={fadeIn} initial="hidden" animate="visible">
          <Card className="border-border/50 overflow-hidden">
            <CardHeader className="pb-4 bg-gradient-to-r from-muted/30 to-transparent">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">Lab Revenue</CardTitle>
                  <CardDescription className="text-xs">Financial overview</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">Total Revenue</p>
                  <p className="text-xl font-bold">{fmt(totalRevenue)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">This Month</p>
                  <div className="flex items-center gap-1.5">
                    <p className="text-xl font-bold">{fmt(monthRevenue)}</p>
                    {monthRevenue > 0 && <ArrowUpRight className="h-4 w-4 text-emerald-500" />}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">Collected</p>
                  <p className="text-xl font-bold text-emerald-600">{fmt(totalPaid)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">Outstanding</p>
                  <div className="flex items-center gap-1.5">
                    <p className="text-xl font-bold text-destructive">{fmt(outstanding)}</p>
                    {outstanding > 0 && <ArrowDownRight className="h-4 w-4 text-destructive" />}
                  </div>
                </div>
              </div>
              <div className="mt-5 pt-4 border-t border-border/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground font-medium">Payment Collection</span>
                  <span className="text-xs font-semibold text-secondary">{paidPercentage}%</span>
                </div>
                <Progress value={paidPercentage} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeIn} initial="hidden" animate="visible" className="space-y-4">
          <Card className="border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 shrink-0">
                  <svg viewBox="0 0 36 36" className="h-16 w-16 -rotate-90">
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="hsl(var(--secondary))" strokeWidth="3" strokeDasharray={`${completionRate}, 100`} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold">{completionRate}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold">Completion Rate</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{deliveredCases} of {totalCases} delivered</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-2 gap-3">
            {secondaryStats.map((stat) => (
              <Card key={stat.title} className="border-border/50">
                <CardContent className="p-3.5 flex items-center gap-2.5">
                  <stat.icon className={`h-4 w-4 ${stat.color} shrink-0`} />
                  <div>
                    <p className="text-lg font-bold leading-none">{stat.value}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{stat.title}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Alert Panels */}
      <motion.div className="grid gap-5 md:grid-cols-3" variants={stagger.container} initial="hidden" animate="visible">
        {/* Urgent Cases */}
        <motion.div variants={stagger.item}>
          <Card className="border-destructive/20 overflow-hidden">
            <CardHeader className="pb-3 bg-gradient-to-r from-destructive/5 to-transparent">
              <CardTitle className="text-sm flex items-center gap-2">
                <div className="h-6 w-6 rounded-md bg-destructive/10 flex items-center justify-center">
                  <Zap className="h-3.5 w-3.5 text-destructive" />
                </div>
                <span className="text-destructive font-semibold">Urgent Cases</span>
                {urgentCases.length > 0 && <Badge variant="destructive" className="ml-auto text-[10px] h-5 px-1.5">{urgentCases.length}</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-1">
              {urgentCases.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="h-8 w-8 text-emerald-500/30 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">No urgent cases</p>
                </div>
              ) : urgentCases.map((c: any) => (
                <div key={c.id} className="p-3 rounded-lg border border-destructive/15 bg-destructive/5 hover:bg-destructive/10 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{c.work_type_name}</span>
                    <Badge variant="destructive" className="text-[9px] px-1.5 h-4">Urgent</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{c.patient_name}</p>
                  {c.due_date && <p className="text-[10px] text-destructive/80 mt-1 font-medium">Due: {format(new Date(c.due_date), "MMM d, yyyy")}</p>}
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Overdue Cases */}
        <motion.div variants={stagger.item}>
          <Card className="border-amber-500/20 overflow-hidden">
            <CardHeader className="pb-3 bg-gradient-to-r from-amber-500/5 to-transparent">
              <CardTitle className="text-sm flex items-center gap-2">
                <div className="h-6 w-6 rounded-md bg-amber-500/10 flex items-center justify-center">
                  <Clock className="h-3.5 w-3.5 text-amber-600" />
                </div>
                <span className="text-amber-700 dark:text-amber-400 font-semibold">Overdue</span>
                {overdueCases.length > 0 && <Badge className="ml-auto text-[10px] h-5 px-1.5 bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20">{overdueCases.length}</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-1">
              {overdueCases.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="h-8 w-8 text-emerald-500/30 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">No overdue cases</p>
                </div>
              ) : overdueCases.map((c: any) => (
                <div key={c.id} className="p-3 rounded-lg border border-amber-500/15 bg-amber-500/5 hover:bg-amber-500/10 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{c.work_type_name}</span>
                    <Badge variant="outline" className="text-[9px] capitalize h-4 px-1.5 border-amber-500/30 text-amber-600">{c.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{c.patient_name}</p>
                  {c.due_date && <p className="text-[10px] text-destructive mt-1 font-medium">Was due: {format(new Date(c.due_date), "MMM d, yyyy")}</p>}
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Due */}
        <motion.div variants={stagger.item}>
          <Card className="border-border/50 overflow-hidden">
            <CardHeader className="pb-3 bg-gradient-to-r from-muted/30 to-transparent">
              <CardTitle className="text-sm flex items-center gap-2">
                <div className="h-6 w-6 rounded-md bg-secondary/10 flex items-center justify-center">
                  <Clock className="h-3.5 w-3.5 text-secondary" />
                </div>
                <span className="font-semibold">Upcoming</span>
                {upcomingDue.length > 0 && <Badge variant="secondary" className="ml-auto text-[10px] h-5 px-1.5">{upcomingDue.length}</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-1">
              {upcomingDue.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-8 w-8 text-muted-foreground/20 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">No upcoming due dates</p>
                </div>
              ) : upcomingDue.map((c: any) => (
                <div key={c.id} className="p-3 rounded-lg border border-border/40 hover:border-secondary/20 hover:bg-muted/30 transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{c.work_type_name}</span>
                    <Badge variant="outline" className="text-[9px] capitalize h-4 px-1.5">{c.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{c.patient_name}</p>
                  <p className="text-[10px] text-muted-foreground mt-1 font-medium">Due: {format(new Date(c.due_date!), "MMM d, yyyy")}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
