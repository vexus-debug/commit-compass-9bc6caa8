import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useLdCases, useLdStaff } from "@/hooks/useLabDashboard";
import { useLdSalaryDeductions, useLdSalaryConfigs } from "@/hooks/useLdSalaryConfig";
import { useAuth } from "@/hooks/useAuth";
import { calculateStaffRevenueAllocation } from "@/hooks/useLdStaffRevenue";
import { getLdCountableCases } from "@/lib/ld-allocation-utils";
import { mergeLdSalaryConfigsWithStaff } from "@/lib/ld-salary-config";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Users, CheckCircle, AlertTriangle, Clock, TrendingUp, Minus, Plus as PlusIcon } from "lucide-react";
import { motion } from "framer-motion";
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";

function computePerformance(cases: any[], technicians: any[], dateStart: Date, dateEnd: Date, salaryConfigs: any[] = []) {
  const allocation = calculateStaffRevenueAllocation(cases, technicians, salaryConfigs, dateStart, dateEnd);
  const allocationByStaffId = new Map(allocation.allocations.map((item: any) => [item.staff_id, item]));

  const periodCases = getLdCountableCases(cases, dateStart, dateEnd);

  // Count repeat cases received WITHIN this period where this tech was the original (penalty tracking).
  // Scoping to the period keeps the drilldown link on the performance card consistent with the deduction shown.
  const allRepeatCases = cases.filter((c: any) => {
    if (!c.original_technician_id) return false;
    const isRepeat = c.remark === "Repeat" || c.remark === "Remake" || !!c.repeat_of_case_id;
    if (!isRepeat) return false;
    const caseDate = new Date(c.received_date || c.created_at);
    return caseDate >= dateStart && caseDate <= dateEnd;
  });

  // Build salary config lookup by staff_id
  const configByStaff: Record<string, { basic_percentage: number; output_percentage: number }> = {};
  salaryConfigs.forEach((sc: any) => {
    configByStaff[sc.staff_id] = {
      basic_percentage: Number(sc.basic_percentage) || 0,
      output_percentage: Number(sc.output_percentage) || 0,
    };
  });

  // Tech case counts
  const techCaseCounts: Record<string, number> = {};
  periodCases.forEach((c: any) => {
    const tid = c.assigned_technician_id;
    if (!tid) return;
    techCaseCounts[tid] = (techCaseCounts[tid] || 0) + 1;
  });

  // Repeat deductions per original tech
  const techRepeatDeductions: Record<string, number> = {};
  allRepeatCases.forEach((rc: any) => {
    const origId = rc.original_technician_id;
    if (origId) techRepeatDeductions[origId] = (techRepeatDeductions[origId] || 0) + 1;
  });

  return technicians.map((tech: any) => {
    const techCases = periodCases.filter((c: any) => c.assigned_technician_id === tech.id);
    const total = techCases.length;
    const fullyCompleted = techCases.filter((c: any) => ["ready", "delivered"].includes(c.status) && (c.completion_type === "full" || !c.completion_type)).length;
    const partiallyCompleted = techCases.filter((c: any) => ["ready", "delivered"].includes(c.status) && c.completion_type === "partial").length;
    const completed = fullyCompleted + partiallyCompleted;
    const inProgress = techCases.filter((c: any) => c.status === "in-progress").length;
    const pending = techCases.filter((c: any) => c.status === "pending").length;
    const rejected = techCases.filter((c: any) => c.remark && ["Rejected", "Damaged", "Suspended"].includes(c.remark)).length;
    const repeatCount = techCases.filter((c: any) => c.remark === "Repeat" || c.remark === "Remake").length;
    const overdue = techCases.filter((c: any) => c.due_date && new Date(c.due_date) < new Date() && !["delivered", "ready"].includes(c.status)).length;
    const urgent = techCases.filter((c: any) => c.is_urgent && !["delivered"].includes(c.status)).length;

    const repeatPenalties = allRepeatCases.filter((c: any) => c.original_technician_id === tech.id).length;
    const bonusReassignments = periodCases.filter((c: any) => c.bonus_reassignment_tech_id === tech.id);

    const fullRevenue = techCases
      .filter((c: any) => ["ready", "delivered"].includes(c.status) && (c.completion_type === "full" || !c.completion_type))
      .reduce((s: number, c: any) => s + Number(c.net_amount || 0), 0);
    const partialRevenue = techCases
      .filter((c: any) => ["ready", "delivered"].includes(c.status) && c.completion_type === "partial")
      .reduce((s: number, c: any) => s + Number(c.net_amount || 0) * 0.5, 0);
    const totalRevenue = fullRevenue + partialRevenue;

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const rejectionRate = total > 0 ? Math.round((rejected / total) * 100) : 0;

    const completedWithDates = techCases.filter((c: any) => c.received_date && c.completed_date);
    const avgTurnaround = completedWithDates.length > 0
      ? Math.round(completedWithDates.reduce((s: number, c: any) => {
          const start = new Date(c.received_date).getTime();
          const end = new Date(c.completed_date).getTime();
          return s + (end - start) / (1000 * 60 * 60 * 24);
        }, 0) / completedWithDates.length)
      : 0;

    // Calculate salary using fixed basic percentages + case-based output rules
    const staffConfig = configByStaff[tech.id] || { basic_percentage: 0, output_percentage: 0 };
    const staffAllocation = allocationByStaffId.get(tech.id);

    const basicShare = Number(staffAllocation?.basic_allocation || 0);
    const outputShare = Number(staffAllocation?.output_allocation || 0);
    const repeatPenaltyAmount = Number(staffAllocation?.repeat_penalty || 0);

    const salaryBase = Math.round((basicShare + outputShare) * 100) / 100;

    return {
      id: tech.id, name: tech.full_name, role: tech.role, specialty: tech.specialty,
      total, completed, fullyCompleted, partiallyCompleted, inProgress, pending, rejected, repeatCount, repeatPenalties, overdue, urgent,
      completionRate, rejectionRate, avgTurnaround, totalRevenue,
      bonusReassignmentCount: bonusReassignments.length,
      // Salary breakdown
      basicSalary: Math.round(basicShare * 100) / 100,
      basicPct: Number(staffAllocation?.basic_percentage ?? staffConfig.basic_percentage),
      outputSalary: Math.round(outputShare * 100) / 100,
      outputPct: Number(staffAllocation?.output_percentage ?? staffConfig.output_percentage),
      salaryBase,
      repeatPenaltyAmount: Math.round(repeatPenaltyAmount * 100) / 100,
    };
  }).sort((a, b) => b.total - a.total);
}

function PerformanceCards({ data, deductions, periodStart, periodEnd }: { data: ReturnType<typeof computePerformance>; deductions: any[]; periodStart: string; periodEnd: string }) {
  const navigate = useNavigate();
  const topPerformer = data.reduce((best, t) => t.completionRate > (best?.completionRate || 0) ? t : best, data[0]);
  const chartData = data.map(t => ({
    name: t.name.split(" ")[0],
    "Fully Completed": t.fullyCompleted,
    "Partially Completed": t.partiallyCompleted,
    "In Progress": t.inProgress,
    Pending: t.pending,
    Rejected: t.rejected,
  }));

  const fmt = (n: number) => "₦" + n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border/50"><CardContent className="p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center"><Users className="h-5 w-5 text-primary" /></div>
          <div><p className="text-[10px] text-muted-foreground uppercase">Active Techs</p><p className="text-xl font-bold">{data.length}</p></div>
        </CardContent></Card>
        <Card className="border-border/50"><CardContent className="p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center"><CheckCircle className="h-5 w-5 text-emerald-500" /></div>
          <div><p className="text-[10px] text-muted-foreground uppercase">Fully Completed</p><p className="text-xl font-bold">{data.reduce((s, t) => s + t.fullyCompleted, 0)}</p></div>
        </CardContent></Card>
        <Card className="border-border/50"><CardContent className="p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center"><Clock className="h-5 w-5 text-amber-500" /></div>
          <div><p className="text-[10px] text-muted-foreground uppercase">Partially Completed</p><p className="text-xl font-bold">{data.reduce((s, t) => s + t.partiallyCompleted, 0)}</p></div>
        </CardContent></Card>
        <Card className="border-border/50"><CardContent className="p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center"><TrendingUp className="h-5 w-5 text-blue-500" /></div>
          <div><p className="text-[10px] text-muted-foreground uppercase">Top Performer</p><p className="text-sm font-bold truncate">{topPerformer?.name || "—"}</p></div>
        </CardContent></Card>
      </div>

      {chartData.length > 0 && (
        <Card className="border-border/50">
          <CardHeader><CardTitle className="text-base">Workload Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Bar dataKey="Fully Completed" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} stackId="stack" />
                <Bar dataKey="Partially Completed" fill="#f59e0b" radius={[2, 2, 0, 0]} stackId="stack" />
                <Bar dataKey="In Progress" fill="#3b82f6" radius={[2, 2, 0, 0]} stackId="stack" />
                <Bar dataKey="Pending" fill="#94a3b8" radius={[2, 2, 0, 0]} stackId="stack" />
                <Bar dataKey="Rejected" fill="#ef4444" radius={[2, 2, 0, 0]} stackId="stack" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {data.map((tech, i) => {
          // Get deductions for this tech
          const techDeductions = deductions.filter((d: any) => d.staff_id === tech.id);
          const loanTotal = techDeductions.filter((d: any) => d.deduction_type === "loan").reduce((s: number, d: any) => s + Number(d.amount), 0);
          const latenessTotal = techDeductions.filter((d: any) => d.deduction_type === "lateness").reduce((s: number, d: any) => s + Number(d.amount), 0);
          const bonusTotal = techDeductions.filter((d: any) => d.deduction_type === "bonus").reduce((s: number, d: any) => s + Number(d.amount), 0);

          const totalDebits = loanTotal + tech.repeatPenaltyAmount + latenessTotal;
          const totalCredits = bonusTotal;
          const finalSalary = Math.max(tech.salaryBase - totalDebits + totalCredits, 0);

          return (
          <motion.div key={tech.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="border-border/50 hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-base">{tech.name}</h3>
                    <div className="flex gap-2 mt-1">
                      {tech.specialty && <Badge variant="outline" className="text-[10px]">{tech.specialty}</Badge>}
                      <Badge variant="secondary" className="text-[10px]">{tech.role}</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className="text-2xl font-bold cursor-pointer hover:text-primary transition-colors"
                      title="Click to view assigned cases"
                      onClick={() => navigate(`/lab-dashboard/cases?${new URLSearchParams({ tech: tech.id, from: periodStart, to: periodEnd }).toString()}`)}
                    >
                      {tech.total}
                    </p>
                    <p className="text-[10px] text-muted-foreground">Total Cases</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Completion Rate</span>
                      <span className="font-semibold">{tech.completionRate}%</span>
                    </div>
                    <Progress value={tech.completionRate} className="h-2" />
                  </div>
                  <div className="grid grid-cols-5 gap-2 text-center pt-2 border-t border-border/30">
                    <div><p className="text-sm font-semibold text-emerald-600">{tech.fullyCompleted}</p><p className="text-[9px] text-muted-foreground">Full</p></div>
                    <div><p className="text-sm font-semibold text-amber-500">{tech.partiallyCompleted}</p><p className="text-[9px] text-muted-foreground">Partial</p></div>
                    <div><p className="text-sm font-semibold text-blue-500">{tech.inProgress}</p><p className="text-[9px] text-muted-foreground">In Prog</p></div>
                    <div><p className="text-sm font-semibold text-destructive">{tech.rejected}</p><p className="text-[9px] text-muted-foreground">Rejected</p></div>
                    <div><p className="text-sm font-semibold text-amber-500">{tech.overdue}</p><p className="text-[9px] text-muted-foreground">Overdue</p></div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/30 text-xs">
                    <div className="flex items-center gap-1.5"><Clock className="h-3 w-3 text-muted-foreground" /><span>Avg: {tech.avgTurnaround}d</span></div>
                    <div className="flex items-center gap-1.5"><AlertTriangle className="h-3 w-3 text-destructive" /><span>Reject: {tech.rejectionRate}%</span></div>
                    <div className="text-right"><span className="font-medium">{fmt(tech.salaryBase)}</span><p className="text-[9px] text-muted-foreground">Salary value</p></div>
                  </div>

                  {/* Salary Breakdown */}
                  <div className="pt-2 border-t border-border/30 space-y-2">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase">Salary Breakdown</p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
                      <span className="text-muted-foreground">Basic ({tech.basicPct}%)</span>
                      <span className="text-right font-medium">{fmt(tech.basicSalary)}</span>
                      <span className="text-muted-foreground">Output ({tech.outputPct}%)</span>
                      <span className="text-right font-medium">{fmt(tech.outputSalary)}</span>
                    </div>

                    {/* Debits */}
                    {(loanTotal > 0 || tech.repeatPenaltyAmount > 0 || latenessTotal > 0) && (
                      <div className="p-2 rounded bg-destructive/5 border border-destructive/10 space-y-1">
                        <p className="text-[10px] font-semibold text-destructive flex items-center gap-1"><Minus className="h-3 w-3" /> Debits</p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px]">
                          {loanTotal > 0 && (<><span className="text-muted-foreground">Loan</span><span className="text-right text-destructive">-{fmt(loanTotal)}</span></>)}
                          {tech.repeatPenaltyAmount > 0 && (<><span
                            className="text-muted-foreground cursor-pointer hover:underline"
                            onClick={() => navigate(`/lab-dashboard/cases?${new URLSearchParams({ originalTech: tech.id, from: periodStart, to: periodEnd, remark: "Repeat" }).toString()}`)}
                            title="Click to view repeat/remake cases"
                          >Repeat deductions</span><span className="text-right text-destructive">-{fmt(tech.repeatPenaltyAmount)}</span></>)}
                          {latenessTotal > 0 && (<><span className="text-muted-foreground">Lateness</span><span className="text-right text-destructive">-{fmt(latenessTotal)}</span></>)}
                        </div>
                      </div>
                    )}

                    {/* Credits */}
                    {bonusTotal > 0 && (
                      <div className="p-2 rounded bg-emerald-500/5 border border-emerald-500/10 space-y-1">
                        <p className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1"><PlusIcon className="h-3 w-3" /> Credits</p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px]">
                          <span className="text-muted-foreground">Bonus</span>
                          <span className="text-right text-emerald-600">+{fmt(bonusTotal)}</span>
                        </div>
                      </div>
                    )}

                    {/* Final Total */}
                    <div className="p-2 rounded bg-primary/5 border border-primary/20">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold">Net Salary</span>
                        <span className="font-bold text-primary">{fmt(finalSalary)}</span>
                      </div>
                    </div>
                  </div>

                  {tech.repeatCount > 0 && (
                    <div className="text-[10px] p-2 rounded bg-amber-500/10 text-amber-700">
                      🔁 {tech.repeatCount} repeat/remake case(s) assigned to this tech
                    </div>
                  )}
                  {tech.repeatPenalties > 0 && (
                    <div className="text-[10px] p-2 rounded bg-destructive/10 text-destructive">
                      ⚠ {tech.repeatPenalties} repeat penalty deduction(s) — 1.5× output % + basic % deducted per case
                    </div>
                  )}
                  {tech.bonusReassignmentCount > 0 && (
                    <div className="text-[10px] p-2 rounded bg-blue-500/10 text-blue-700">
                      🎯 {tech.bonusReassignmentCount} bonus job re-assignment(s) received
                    </div>
                  )}
                  {tech.partiallyCompleted > 0 && (
                    <div className="text-[10px] p-2 rounded bg-amber-500/10 text-amber-700">
                      ⚠ {tech.partiallyCompleted} partially completed case(s) in this period
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
          );
        })}
        {data.length === 0 && (
          <div className="col-span-2 text-center py-16 text-muted-foreground">
            <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No active technicians found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LdTechPerformancePage() {
  const { data: cases = [] } = useLdCases();
  const { data: staff = [] } = useLdStaff();
  const { roles, user } = useAuth();
  const isAdmin = roles.includes("admin") || roles.includes("lab_manager");

  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), "yyyy-MM"));
  const [fiscalYear, setFiscalYear] = useState(new Date().getFullYear().toString());

  // For non-admin, filter to only show their own performance
  const technicians = useMemo(() => {
    const active = staff.filter((s: any) => s.status === "active");
    if (isAdmin) return active;
    // Non-admin: match by user_id or email
    return active.filter((s: any) =>
      (s.user_id && s.user_id === user?.id) ||
      (s.email && user?.email && s.email.toLowerCase() === user.email.toLowerCase())
    );
  }, [staff, isAdmin, user?.id, user?.email]);

  const monthStart = startOfMonth(new Date(selectedMonth + "-01"));
  const monthEnd = endOfMonth(monthStart);
  const yearStart = startOfYear(new Date(Number(fiscalYear), 0));
  const yearEnd = endOfYear(yearStart);
  const mStart = format(monthStart, "yyyy-MM-dd");
  const mEnd = format(monthEnd, "yyyy-MM-dd");
  const yStart = format(yearStart, "yyyy-MM-dd");
  const yEnd = format(yearEnd, "yyyy-MM-dd");

  const { data: monthlySalaryConfigs = [] } = useLdSalaryConfigs(mStart, mEnd);
  const { data: fiscalSalaryConfigs = [] } = useLdSalaryConfigs(yStart, yEnd);
  const resolvedMonthlySalaryConfigs = useMemo(() => mergeLdSalaryConfigsWithStaff(technicians, monthlySalaryConfigs), [technicians, monthlySalaryConfigs]);
  const resolvedFiscalSalaryConfigs = useMemo(() => mergeLdSalaryConfigsWithStaff(technicians, fiscalSalaryConfigs), [technicians, fiscalSalaryConfigs]);

  const monthlyData = useMemo(() => computePerformance(cases, technicians, monthStart, monthEnd, resolvedMonthlySalaryConfigs), [cases, technicians, monthStart, monthEnd, resolvedMonthlySalaryConfigs]);
  const fiscalData = useMemo(() => computePerformance(cases, technicians, yearStart, yearEnd, resolvedFiscalSalaryConfigs), [cases, technicians, yearStart, yearEnd, resolvedFiscalSalaryConfigs]);

  // Fetch deductions for both periods
  const { data: monthlyDeductions = [] } = useLdSalaryDeductions(mStart, mEnd);
  const { data: fiscalDeductions = [] } = useLdSalaryDeductions(yStart, yEnd);

  return (
    <div className="space-y-6">
      <PageHeader
        title={isAdmin ? "Technician Performance" : "My Performance"}
        description={isAdmin ? "Output rates, completion types, and salary-relevant metrics" : "Your output rates and performance metrics"}
      />

      <Tabs defaultValue="monthly" className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <TabsList>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="fiscal">Fiscal Year</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="w-[160px]" />
            <Select value={fiscalYear} onValueChange={setFiscalYear}>
              <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {[2024, 2025, 2026, 2027].map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="monthly">
          <h2 className="text-lg font-semibold mb-4">{format(monthStart, "MMMM yyyy")}</h2>
          <PerformanceCards data={monthlyData} deductions={monthlyDeductions} periodStart={mStart} periodEnd={mEnd} />
        </TabsContent>
        <TabsContent value="fiscal">
          <h2 className="text-lg font-semibold mb-4">Fiscal Year {fiscalYear}</h2>
          <PerformanceCards data={fiscalData} deductions={fiscalDeductions} periodStart={yStart} periodEnd={yEnd} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
