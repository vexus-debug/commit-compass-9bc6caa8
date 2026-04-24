import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useLdCases, useLdStaff } from "@/hooks/useLabDashboard";
import { useLdSalaryConfigs, useSaveLdSalaryConfig, useLdSalaryDeductions, useCreateLdSalaryDeduction, useDeleteLdSalaryDeduction } from "@/hooks/useLdSalaryConfig";
import { useLdRemainingCategories } from "@/hooks/useLdRemainingCategories";
import { useAuth } from "@/hooks/useAuth";
import { DollarSign, Settings, Trash2, Plus, Users, PieChart, Layers } from "lucide-react";
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths } from "date-fns";
import { motion } from "framer-motion";
import { calculateStaffRevenueAllocation } from "@/hooks/useLdStaffRevenue";
import { mergeLdSalaryConfigsWithStaff } from "@/lib/ld-salary-config";

const fmt = (n: number) => new Intl.NumberFormat("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

export default function LdSalaryAllocationPage() {
  const navigate = useNavigate();
  const { roles, user } = useAuth();
  const isAdmin = roles.includes("admin");
  const { data: cases = [] } = useLdCases();
  const { data: staff = [] } = useLdStaff();
  const { data: remainingCategories = [] } = useLdRemainingCategories();

  // Period selection
  const [periodType, setPeriodType] = useState("month");
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), "yyyy-MM"));

  const periodStart = useMemo(() => {
    if (periodType === "month") {
      const [y, m] = selectedMonth.split("-").map(Number);
      return startOfMonth(new Date(y, m - 1));
    }
    return startOfYear(new Date());
  }, [periodType, selectedMonth]);

  const periodEnd = useMemo(() => {
    if (periodType === "month") {
      const [y, m] = selectedMonth.split("-").map(Number);
      return endOfMonth(new Date(y, m - 1));
    }
    return endOfYear(new Date());
  }, [periodType, selectedMonth]);

  const pStart = format(periodStart, "yyyy-MM-dd");
  const pEnd = format(periodEnd, "yyyy-MM-dd");

  const { data: salaryConfigs = [] } = useLdSalaryConfigs(pStart, pEnd);
  const resolvedSalaryConfigs = useMemo(() => mergeLdSalaryConfigsWithStaff(staff, salaryConfigs), [staff, salaryConfigs]);
  const saveConfigsForPeriod = useSaveLdSalaryConfig();
  const { data: deductions = [] } = useLdSalaryDeductions(pStart, pEnd);
  const createDeduction = useCreateLdSalaryDeduction();
  const deleteDeduction = useDeleteLdSalaryDeduction();

  // Edit percentages dialog
  const [editOpen, setEditOpen] = useState(false);
  const [editConfigs, setEditConfigs] = useState<{ id?: string; staff_id: string; name: string; basic_percentage: number; output_percentage: number; isSuggested?: boolean }[]>([]);

  // Add deduction dialog
  const [deductionOpen, setDeductionOpen] = useState(false);
  const [deductionForm, setDeductionForm] = useState({ staff_id: "", deduction_type: "lateness", amount: 0, notes: "" });

  // Calculate salary allocation
  const allocation = useMemo(() => {
    const baseAllocation = calculateStaffRevenueAllocation(cases, staff, resolvedSalaryConfigs, periodStart, periodEnd);

    const rows = baseAllocation.allocations.map((entry: any) => {
      const staffDeductions = deductions.filter((d: any) => d.staff_id === entry.staff_id);
      const latenessTotal = staffDeductions.filter((d: any) => d.deduction_type === "lateness").reduce((s: number, d: any) => s + Number(d.amount), 0);
      const loanTotal = staffDeductions.filter((d: any) => d.deduction_type === "loan").reduce((s: number, d: any) => s + Number(d.amount), 0);
      const bonusTotal = staffDeductions.filter((d: any) => d.deduction_type === "bonus").reduce((s: number, d: any) => s + Number(d.amount), 0);
      const gross = Number(entry.basic_allocation || 0) + Number(entry.output_allocation || 0) - Number(entry.repeat_penalty || 0) - Number(entry.shared_debit || 0) + Number(entry.shared_credit || 0);

      return {
        staffId: entry.staff_id,
        name: entry.staff_name,
        role: entry.role,
        basicPct: entry.basic_percentage,
        outputPct: entry.output_percentage,
        caseCount: entry.jobs_count,
        basicSalary: entry.basic_allocation,
        outputSalary: entry.output_allocation,
        lateness: latenessTotal,
        loan: loanTotal,
        total: Math.max(gross - latenessTotal - loanTotal + bonusTotal, 0),
      };
    });

    return {
      ...baseAllocation,
      rows,
    };
  }, [cases, staff, resolvedSalaryConfigs, deductions, periodStart, periodEnd]);

  const basicTotal = useMemo(
    () => editConfigs.reduce((sum, config) => sum + Number(config.basic_percentage || 0), 0),
    [editConfigs],
  );
  const basicTotalValid = Math.abs(basicTotal - 100) < 0.01;

  const openEditDialog = () => {
    setEditConfigs(resolvedSalaryConfigs.map((c: any) => ({
      id: c.id,
      staff_id: c.staff_id,
      name: c.staff?.full_name || "Unknown",
      basic_percentage: c.basic_percentage,
      output_percentage: c.output_percentage,
      isSuggested: c.isSuggested,
    })));
    setEditOpen(true);
  };

  const saveConfigs = async () => {
    if (!basicTotalValid) return;

    await saveConfigsForPeriod.mutateAsync({
      effectiveFrom: pStart,
      configs: editConfigs.map((config) => ({
        staff_id: config.staff_id,
        basic_percentage: config.basic_percentage,
        output_percentage: config.output_percentage,
      })),
    });
    setEditOpen(false);
  };

  const handleAddDeduction = async () => {
    if (!deductionForm.staff_id || deductionForm.amount <= 0) return;
    await createDeduction.mutateAsync({
      staff_id: deductionForm.staff_id,
      period_start: pStart,
      period_end: pEnd,
      deduction_type: deductionForm.deduction_type,
      amount: deductionForm.amount,
      notes: deductionForm.notes || undefined,
    });
    setDeductionForm({ staff_id: "", deduction_type: "lateness", amount: 0, notes: "" });
    setDeductionOpen(false);
  };

  // Generate month options
  const monthOptions = useMemo(() => {
    const opts = [];
    for (let i = 0; i < 12; i++) {
      const d = subMonths(new Date(), i);
      opts.push({ value: format(d, "yyyy-MM"), label: format(d, "MMMM yyyy") });
    }
    return opts;
  }, []);

  const buildCasesLink = (extra: Record<string, string>) => {
    const params = new URLSearchParams({ from: pStart, to: pEnd, ...extra });
    return `/lab-dashboard/cases?${params.toString()}`;
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Staff Salary Allocation" description="Revenue-based salary distribution with deductions" />

      {/* Period & Controls */}
      <div className="flex flex-wrap gap-3 items-end">
        <div className="space-y-1">
          <Label className="text-xs">Period</Label>
          <Select value={periodType} onValueChange={setPeriodType}>
            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Monthly</SelectItem>
              <SelectItem value="year">Fiscal Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {periodType === "month" && (
          <div className="space-y-1">
            <Label className="text-xs">Month</Label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {monthOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="flex gap-2 ml-auto">
          {isAdmin && (
            <>
              <Button variant="outline" size="sm" onClick={openEditDialog}>
                <Settings className="h-4 w-4 mr-1" /> Edit Percentages
              </Button>
              <Button variant="outline" size="sm" onClick={() => setDeductionOpen(true)}>
                <Plus className="h-4 w-4 mr-1" /> Add Deduction
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-4 pb-3">
            <p className="text-xs text-muted-foreground">Total Revenue</p>
            <p className="text-lg font-bold">₦{fmt(allocation.totalProductiveRevenue)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <p className="text-xs text-muted-foreground">Output Base (20%)</p>
            <p className="text-lg font-bold">₦{fmt(allocation.outputPool)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <p className="text-xs text-muted-foreground">Basic Base (10%)</p>
            <p className="text-lg font-bold">₦{fmt(allocation.basicPool)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <p className="text-xs text-muted-foreground">Assigned Cases</p>
            <p className="text-lg font-bold">{allocation.totalJobs}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <p className="text-xs text-muted-foreground">Unassigned Cases</p>
            {isAdmin && allocation.unassignedCasesCount > 0 ? (
              <Button
                variant="link"
                className="h-auto p-0 text-lg font-bold"
                onClick={() => navigate(buildCasesLink({ assigned: "unassigned" }))}
              >
                {allocation.unassignedCasesCount}
              </Button>
            ) : (
              <p className="text-lg font-bold">{allocation.unassignedCasesCount}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Allocation Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" /> Salary Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff</TableHead>
                  {isAdmin && <TableHead className="text-right">Basic %</TableHead>}
                  <TableHead className="text-right">Basic Salary</TableHead>
                  <TableHead className="text-right">Output</TableHead>
                  <TableHead className="text-right">Lateness</TableHead>
                  <TableHead className="text-right">Loan</TableHead>
                  <TableHead className="text-right font-bold">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(allocation.rows || [])
                  .filter((row: any) => isAdmin || staff.some((s: any) => s.id === row.staffId && (s.user_id === user?.id || (s.email && user?.email && s.email.toLowerCase() === user.email.toLowerCase()))))
                  .map((row: any) => (
                  <TableRow key={row.staffId}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{row.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{row.role?.replace("_", " ")}</p>
                      </div>
                    </TableCell>
                    {isAdmin && <TableCell className="text-right text-xs">{row.basicPct}%</TableCell>}
                    <TableCell className="text-right">₦{fmt(row.basicSalary)}</TableCell>
                    <TableCell className="text-right">₦{fmt(row.outputSalary)}</TableCell>
                    <TableCell className="text-right text-destructive">{row.lateness > 0 ? `-₦${fmt(row.lateness)}` : "—"}</TableCell>
                    <TableCell className="text-right text-destructive">{row.loan > 0 ? `-₦${fmt(row.loan)}` : "—"}</TableCell>
                    <TableCell className="text-right font-bold">₦{fmt(row.total)}</TableCell>
                  </TableRow>
                ))}
                {/* Totals row */}
                <TableRow className="bg-muted/50 font-bold">
                  <TableCell>TOTAL</TableCell>
                  {isAdmin && <TableCell className="text-right text-xs">100%</TableCell>}
                  <TableCell className="text-right">₦{fmt((allocation.rows || []).reduce((s: number, r: any) => s + r.basicSalary, 0))}</TableCell>
                  <TableCell className="text-right">₦{fmt((allocation.rows || []).reduce((s: number, r: any) => s + r.outputSalary, 0))}</TableCell>
                  <TableCell className="text-right text-destructive">
                    {(allocation.rows || []).reduce((s: number, r: any) => s + r.lateness, 0) > 0
                      ? `-₦${fmt((allocation.rows || []).reduce((s: number, r: any) => s + r.lateness, 0))}`
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right text-destructive">
                    {(allocation.rows || []).reduce((s: number, r: any) => s + r.loan, 0) > 0
                      ? `-₦${fmt((allocation.rows || []).reduce((s: number, r: any) => s + r.loan, 0))}`
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right">₦{fmt((allocation.rows || []).reduce((s: number, r: any) => s + r.total, 0))}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Deductions List (admin only) */}
      {isAdmin && deductions.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Deductions This Period</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deductions.map((d: any) => (
                    <TableRow key={d.id}>
                      <TableCell>{d.staff?.full_name || "—"}</TableCell>
                      <TableCell>
                        <Badge variant={d.deduction_type === "lateness" ? "destructive" : d.deduction_type === "bonus" ? "default" : "secondary"} className="capitalize">
                          {d.deduction_type === "bonus" ? `${d.deduction_type} (+)` : d.deduction_type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">₦{fmt(Number(d.amount))}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{d.notes || "—"}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => deleteDeduction.mutate(d.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 70% Remaining Breakdown */}
      {allocation.totalRemaining > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <PieChart className="h-4 w-4" /> 70% Remaining Breakdown — ₦{fmt(allocation.totalRemaining)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">%</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {remainingCategories.map((cat: any) => (
                    <TableRow key={cat.id}>
                      <TableCell className="font-medium">{cat.category_name}</TableCell>
                      <TableCell className="text-right">{cat.percentage}%</TableCell>
                      <TableCell className="text-right">₦{fmt(allocation.totalRemaining * Number(cat.percentage) / 100)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50 font-bold">
                    <TableCell>TOTAL</TableCell>
                    <TableCell className="text-right">{remainingCategories.reduce((s: number, c: any) => s + Number(c.percentage), 0)}%</TableCell>
                    <TableCell className="text-right">₦{fmt(remainingCategories.reduce((s: number, c: any) => s + allocation.totalRemaining * Number(c.percentage) / 100, 0))}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Per-Work-Type Breakdown */}
      {(allocation.workTypeBreakdowns || []).length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Layers className="h-4 w-4" /> Per Work Type Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(allocation.workTypeBreakdowns || []).map((wt: any) => (
              <div key={wt.work_type} className="border rounded-lg p-3 space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="outline" className="text-sm font-bold">{wt.work_type}</Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Button
                      variant="link"
                      className="h-auto p-0 text-xs"
                      onClick={() => navigate(buildCasesLink({ workType: wt.work_type }))}
                    >
                      {wt.caseCount} case{wt.caseCount !== 1 ? "s" : ""}
                    </Button>
                    <span>· {wt.totalUnits} unit{wt.totalUnits !== 1 ? "s" : ""}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="bg-muted rounded p-2">
                    <p className="text-muted-foreground">Total Value</p>
                    <p className="font-bold">₦{fmt(wt.totalCaseValue)}</p>
                  </div>
                  <div className="bg-muted rounded p-2">
                    <p className="text-muted-foreground">Basic (10%)</p>
                    <p className="font-bold">₦{fmt(wt.basicPool)}</p>
                  </div>
                  <div className="bg-muted rounded p-2">
                    <p className="text-muted-foreground">Output (20%)</p>
                    <p className="font-bold">₦{fmt(wt.outputPool)}</p>
                  </div>
                  <div className="bg-muted rounded p-2">
                    <p className="text-muted-foreground">Remaining (70%)</p>
                    <p className="font-bold">₦{fmt(wt.remaining)}</p>
                  </div>
                </div>
                {wt.staffBreakdown?.length > 0 && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Staff</TableHead>
                        <TableHead className="text-xs">Role</TableHead>
                        <TableHead className="text-right text-xs">Basic</TableHead>
                        <TableHead className="text-right text-xs">Output</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {wt.staffBreakdown.map((sb: any) => (
                        <TableRow key={sb.staff_id}>
                          <TableCell className="text-xs">{sb.staff_name}</TableCell>
                          <TableCell className="text-xs capitalize">{sb.role?.replace("_", " ")}</TableCell>
                          <TableCell className="text-right text-xs">₦{fmt(sb.basic_amount)}</TableCell>
                          <TableCell className="text-right text-xs">₦{fmt(sb.output_amount)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}


      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-3xl">
          <DialogHeader><DialogTitle>Edit Salary Percentages</DialogTitle></DialogHeader>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            <div className="rounded-md border bg-muted/40 p-3 text-xs text-muted-foreground">
              Changes save a new salary setup starting from <span className="font-medium text-foreground">{format(periodStart, "MMM d, yyyy")}</span>, so older periods keep their historical percentages.
            </div>
            {editConfigs.map((c, i) => (
              <div key={c.staff_id} className="space-y-3 rounded-lg border p-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium truncate">{c.name}</span>
                  {c.isSuggested && <span className="text-[10px] text-muted-foreground">New staff</span>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[10px]">Basic %</Label>
                    <Input
                      type="number"
                      step="0.001"
                      value={c.basic_percentage}
                      onChange={(e) => {
                        const updated = [...editConfigs];
                        updated[i].basic_percentage = Number(e.target.value);
                        setEditConfigs(updated);
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px]">Output %</Label>
                    <Input
                      type="number"
                      step="0.001"
                      value={c.output_percentage}
                      onChange={(e) => {
                        const updated = [...editConfigs];
                        updated[i].output_percentage = Number(e.target.value);
                        setEditConfigs(updated);
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
            {!basicTotalValid && (
              <div className="rounded-md border border-destructive/20 bg-destructive/5 p-3 text-xs text-destructive">
                Basic percentages must total exactly 100% before this can be saved.
              </div>
            )}
            <div className="text-xs text-muted-foreground pt-2 space-y-1">
              <p>Basic total: <span className={basicTotalValid ? "text-foreground font-medium" : "text-destructive font-medium"}>{basicTotal.toFixed(3)}%</span></p>
              <p>Output uses assigned units for technicians and total assigned cases for role-based staff.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={saveConfigs} disabled={saveConfigsForPeriod.isPending || !basicTotalValid}>
              {saveConfigsForPeriod.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Deduction Dialog (Admin only) */}
      <Dialog open={deductionOpen} onOpenChange={setDeductionOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Deduction</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs">Staff Member</Label>
              <Select value={deductionForm.staff_id} onValueChange={(v) => setDeductionForm({ ...deductionForm, staff_id: v })}>
                <SelectTrigger><SelectValue placeholder="Select staff" /></SelectTrigger>
                <SelectContent>
                  {staff.filter((s: any) => s.status === "active").map((s: any) => (
                    <SelectItem key={s.id} value={s.id}>{s.full_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Type</Label>
              <Select value={deductionForm.deduction_type} onValueChange={(v) => setDeductionForm({ ...deductionForm, deduction_type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="lateness">Lateness</SelectItem>
                  <SelectItem value="loan">Loan / Balance</SelectItem>
                  <SelectItem value="bonus">Bonus (+Credit)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Amount (₦)</Label>
              <Input
                type="number"
                value={deductionForm.amount || ""}
                onChange={(e) => setDeductionForm({ ...deductionForm, amount: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Notes</Label>
              <Input
                value={deductionForm.notes}
                onChange={(e) => setDeductionForm({ ...deductionForm, notes: e.target.value })}
                placeholder="Optional notes"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeductionOpen(false)}>Cancel</Button>
            <Button onClick={handleAddDeduction} disabled={createDeduction.isPending}>
              {createDeduction.isPending ? "Adding..." : "Add Deduction"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
