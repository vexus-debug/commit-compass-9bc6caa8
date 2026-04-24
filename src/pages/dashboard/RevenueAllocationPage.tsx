import { useState, useEffect, useMemo } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DollarSign, TrendingUp, Wallet, PiggyBank, Shield, Save, Edit2, X,
} from "lucide-react";
import {
  useRevenueAllocationRules,
  useStaffAllocationRules,
  useUpdateRevenueRules,
  useUpdateStaffRules,
  useToggleAllocationActive,
  useRevenueSummary,
  useAllocationBreakdown,
  useStaffAllocationBreakdown,
} from "@/hooks/useRevenueAllocation";

const fmt = (v: number) =>
  "₦" + v.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "Direct Costs": "Lab materials, Rent",
  "Base Operations": "Staff salaries (feeds Staff Operations)",
  "Volume Bonus Pool": "Shared among staff per treatment",
  "Clinical Savings": "Equipment, Expansion, Growth",
  "Investors": "70/30 clinic/investor split",
  "Tithe": "Spiritual / charitable allocation",
};

export default function RevenueAllocationPage() {
  const { data: rules = [], isLoading: rulesLoading } = useRevenueAllocationRules();
  const { data: staffRules = [], isLoading: staffLoading } = useStaffAllocationRules();
  const { data: summary, isLoading: summaryLoading } = useRevenueSummary();
  const { data: breakdown } = useAllocationBreakdown();
  const { data: staffBreakdown } = useStaffAllocationBreakdown();
  const updateRules = useUpdateRevenueRules();
  const updateStaffRules = useUpdateStaffRules();
  const toggleActive = useToggleAllocationActive();

  const isActive = rules.length > 0 && rules[0]?.is_active;

  // Revenue rules editing
  const [editingRevenue, setEditingRevenue] = useState(false);
  const [draftRevenue, setDraftRevenue] = useState<Record<string, { percentage: number; effective_from: string; effective_to: string }>>({});
  const revenueTotal = useMemo(
    () => Object.values(draftRevenue).reduce((s, v) => s + (v?.percentage || 0), 0),
    [draftRevenue]
  );

  useEffect(() => {
    if (rules.length > 0 && !editingRevenue) {
      const m: Record<string, { percentage: number; effective_from: string; effective_to: string }> = {};
      rules.forEach((r: any) => (m[r.id] = { percentage: Number(r.percentage), effective_from: r.effective_from || "", effective_to: r.effective_to || "" }));
      setDraftRevenue(m);
    }
  }, [rules, editingRevenue]);

  // Staff rules editing
  const [editingStaff, setEditingStaff] = useState(false);
  const [draftStaff, setDraftStaff] = useState<Record<string, { percentage: number; effective_from: string; effective_to: string }>>({});
  const staffTotal = useMemo(
    () => Object.values(draftStaff).reduce((s, v) => s + (v?.percentage || 0), 0),
    [draftStaff]
  );

  useEffect(() => {
    if (staffRules.length > 0 && !editingStaff) {
      const m: Record<string, { percentage: number; effective_from: string; effective_to: string }> = {};
      staffRules.forEach((r: any) => (m[r.id] = { percentage: Number(r.percentage), effective_from: r.effective_from || "", effective_to: r.effective_to || "" }));
      setDraftStaff(m);
    }
  }, [staffRules, editingStaff]);

  const handleSaveRevenue = () => {
    const arr = Object.entries(draftRevenue).map(([id, v]) => ({
      id,
      percentage: v.percentage,
      effective_from: v.effective_from || undefined,
      effective_to: v.effective_to || null,
    }));
    updateRules.mutate(arr, { onSuccess: () => setEditingRevenue(false) });
  };

  const handleSaveStaff = () => {
    const arr = Object.entries(draftStaff).map(([id, v]) => ({
      id,
      percentage: v.percentage,
      effective_from: v.effective_from || undefined,
      effective_to: v.effective_to || null,
    }));
    updateStaffRules.mutate(arr, { onSuccess: () => setEditingStaff(false) });
  };

  const investorsAllTime = (breakdown?.allTime?.["Investors"] || 0);
  const investorsMonth = (breakdown?.thisMonth?.["Investors"] || 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Revenue Allocation"
          description="Automatic revenue distribution across operations, staff, savings, investors & reserves."
        />
        <div className="flex items-center gap-3">
          <Label htmlFor="allocation-toggle" className="text-sm text-muted-foreground">
            System {isActive ? "Active" : "Disabled"}
          </Label>
          <Switch
            id="allocation-toggle"
            checked={!!isActive}
            onCheckedChange={(v) => toggleActive.mutate(v)}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          title="Total Revenue"
          value={fmt(summary?.totalRevenue ?? 0)}
          subtitle="All-time"
          icon={<DollarSign className="h-5 w-5" />}
          loading={summaryLoading}
        />
        <SummaryCard
          title="Revenue This Month"
          value={fmt(summary?.monthRevenue ?? 0)}
          subtitle="Current month"
          icon={<TrendingUp className="h-5 w-5" />}
          loading={summaryLoading}
        />
        <SummaryCard
          title="War Chest"
          value={fmt(summary?.warChestTotal ?? 0)}
          subtitle="Reserve fund from excess payments"
          icon={<Shield className="h-5 w-5" />}
          loading={summaryLoading}
          accent
        />
      </div>

      {/* Revenue Allocation Rules */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <div>
            <CardTitle className="text-lg">Allocation Rules</CardTitle>
            <CardDescription>Applied automatically to every payment</CardDescription>
          </div>
          {!editingRevenue ? (
            <Button variant="outline" size="sm" onClick={() => setEditingRevenue(true)}>
              <Edit2 className="h-4 w-4 mr-1.5" /> Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingRevenue(false)}
              >
                <X className="h-4 w-4 mr-1" /> Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSaveRevenue}
                disabled={revenueTotal !== 100 || updateRules.isPending}
              >
                <Save className="h-4 w-4 mr-1.5" /> Save
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {editingRevenue && revenueTotal !== 100 && (
            <div className="mb-3 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              Total must equal 100%. Currently: {revenueTotal}%
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right w-24">%</TableHead>
                <TableHead className="text-center">Effective From</TableHead>
                <TableHead className="text-center">Effective To</TableHead>
                <TableHead className="text-right">All-time</TableHead>
                <TableHead className="text-right">This Month</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((rule: any) => (
                <TableRow key={rule.id}>
                  <TableCell className="font-medium">{rule.category}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {CATEGORY_DESCRIPTIONS[rule.category] || ""}
                  </TableCell>
                  <TableCell className="text-right">
                    {editingRevenue ? (
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        className="w-20 ml-auto text-right h-8"
                        value={draftRevenue[rule.id]?.percentage ?? ""}
                        onChange={(e) =>
                          setDraftRevenue((p) => ({ ...p, [rule.id]: { ...p[rule.id], percentage: Number(e.target.value) } }))
                        }
                      />
                    ) : (
                      <Badge variant="secondary">{rule.percentage}%</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {editingRevenue ? (
                      <Input type="date" className="w-36 h-8 text-xs" value={draftRevenue[rule.id]?.effective_from || ""}
                        onChange={(e) => setDraftRevenue((p) => ({ ...p, [rule.id]: { ...p[rule.id], effective_from: e.target.value } }))} />
                    ) : (
                      <span className="text-xs">{rule.effective_from || "—"}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {editingRevenue ? (
                      <Input type="date" className="w-36 h-8 text-xs" value={draftRevenue[rule.id]?.effective_to || ""}
                        onChange={(e) => setDraftRevenue((p) => ({ ...p, [rule.id]: { ...p[rule.id], effective_to: e.target.value } }))} />
                    ) : (
                      <span className="text-xs">{rule.effective_to || "Open-ended"}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {fmt(breakdown?.allTime?.[rule.category] || 0)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {fmt(breakdown?.thisMonth?.[rule.category] || 0)}
                  </TableCell>
                </TableRow>
              ))}
              {editingRevenue && (
                <TableRow className="border-t-2">
                  <TableCell className="font-bold">Total</TableCell>
                  <TableCell />
                  <TableCell className="text-right">
                    <Badge variant={revenueTotal === 100 ? "default" : "destructive"}>
                      {revenueTotal}%
                    </Badge>
                  </TableCell>
                  <TableCell />
                  <TableCell />
                  <TableCell />
                  <TableCell />
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Investors 70/30 breakdown */}
          {(investorsAllTime > 0 || investorsMonth > 0) && (
            <div className="mt-4 rounded-lg border p-4 bg-muted/30">
              <p className="text-sm font-medium mb-2">Investors 70/30 Breakdown</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Clinic Share (70%)</span>
                  <p className="font-mono font-medium">{fmt(investorsAllTime * 0.7)} all-time</p>
                  <p className="font-mono text-xs text-muted-foreground">{fmt(investorsMonth * 0.7)} this month</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Investor Share (30%)</span>
                  <p className="font-mono font-medium">{fmt(investorsAllTime * 0.3)} all-time</p>
                  <p className="font-mono text-xs text-muted-foreground">{fmt(investorsMonth * 0.3)} this month</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Staff Operations Allocation */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <div>
            <CardTitle className="text-lg">Staff Operations</CardTitle>
            <CardDescription>
              Sub-allocation of Base Operations ({fmt(breakdown?.allTime?.["Base Operations"] || 0)} all-time)
            </CardDescription>
          </div>
          {!editingStaff ? (
            <Button variant="outline" size="sm" onClick={() => setEditingStaff(true)}>
              <Edit2 className="h-4 w-4 mr-1.5" /> Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setEditingStaff(false)}>
                <X className="h-4 w-4 mr-1" /> Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSaveStaff}
                disabled={staffTotal !== 100 || updateStaffRules.isPending}
              >
                <Save className="h-4 w-4 mr-1.5" /> Save
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {editingStaff && staffTotal !== 100 && (
            <div className="mb-3 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              Total must equal 100%. Currently: {staffTotal}%
            </div>
          )}
           <Table>
             <TableHeader>
               <TableRow>
                 <TableHead>Staff Role</TableHead>
                 <TableHead className="text-right w-24">%</TableHead>
                 <TableHead className="text-center">Effective From</TableHead>
                 <TableHead className="text-center">Effective To</TableHead>
                 <TableHead className="text-right">All-time Payout</TableHead>
                 <TableHead className="text-right">This Month</TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
               {staffRules.map((rule: any) => (
                 <TableRow key={rule.id}>
                   <TableCell className="font-medium">{rule.role_title}</TableCell>
                   <TableCell className="text-right">
                     {editingStaff ? (
                       <Input
                         type="number"
                         min={0}
                         max={100}
                         className="w-20 ml-auto text-right h-8"
                         value={draftStaff[rule.id]?.percentage ?? ""}
                         onChange={(e) =>
                           setDraftStaff((p) => ({ ...p, [rule.id]: { ...p[rule.id], percentage: Number(e.target.value) } }))
                         }
                       />
                     ) : (
                       <Badge variant="secondary">{rule.percentage}%</Badge>
                     )}
                   </TableCell>
                   <TableCell className="text-center">
                     {editingStaff ? (
                       <Input type="date" className="w-36 h-8 text-xs" value={draftStaff[rule.id]?.effective_from || ""}
                         onChange={(e) => setDraftStaff((p) => ({ ...p, [rule.id]: { ...p[rule.id], effective_from: e.target.value } }))} />
                     ) : (
                       <span className="text-xs">{rule.effective_from || "—"}</span>
                     )}
                   </TableCell>
                   <TableCell className="text-center">
                     {editingStaff ? (
                       <Input type="date" className="w-36 h-8 text-xs" value={draftStaff[rule.id]?.effective_to || ""}
                         onChange={(e) => setDraftStaff((p) => ({ ...p, [rule.id]: { ...p[rule.id], effective_to: e.target.value } }))} />
                     ) : (
                       <span className="text-xs">{rule.effective_to || "Open-ended"}</span>
                     )}
                   </TableCell>
                   <TableCell className="text-right font-mono text-sm">
                     {fmt(staffBreakdown?.allTime?.[rule.role_title] || 0)}
                   </TableCell>
                   <TableCell className="text-right font-mono text-sm">
                     {fmt(staffBreakdown?.thisMonth?.[rule.role_title] || 0)}
                   </TableCell>
                 </TableRow>
               ))}
               {editingStaff && (
                 <TableRow className="border-t-2">
                   <TableCell className="font-bold">Total</TableCell>
                   <TableCell className="text-right">
                     <Badge variant={staffTotal === 100 ? "default" : "destructive"}>
                       {staffTotal}%
                     </Badge>
                   </TableCell>
                   <TableCell />
                   <TableCell />
                   <TableCell />
                   <TableCell />
                 </TableRow>
               )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* War Chest Detail */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-secondary" /> War Chest Reserve
          </CardTitle>
          <CardDescription>
            Excess payments automatically routed here. Used for pro-bono care, emergencies & business stability.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-muted/40 p-6 text-center">
            <p className="text-sm text-muted-foreground mb-1">Running Total</p>
            <p className="text-3xl font-bold font-mono">{fmt(summary?.warChestTotal ?? 0)}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Only increases from excess payments · Never auto-distributed
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryCard({
  title, value, subtitle, icon, loading, accent,
}: {
  title: string; value: string; subtitle: string; icon: React.ReactNode; loading?: boolean; accent?: boolean;
}) {
  return (
    <Card className={accent ? "border-secondary/30 bg-secondary/5" : ""}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
          <div className={`p-2 rounded-lg ${accent ? "bg-secondary/10 text-secondary" : "bg-muted text-muted-foreground"}`}>
            {icon}
          </div>
        </div>
        {loading ? (
          <div className="h-8 w-32 bg-muted animate-pulse rounded" />
        ) : (
          <p className="text-2xl font-bold font-mono">{value}</p>
        )}
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      </CardContent>
    </Card>
  );
}
