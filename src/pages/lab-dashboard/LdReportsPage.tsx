import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useLdCases, useLdInvoices, useLdPayments, useLdClients, useLdStaff, useLdWorkTypes } from "@/hooks/useLabDashboard";
import { useLdCreditNotes } from "@/hooks/useLdCaseExtras";
import { useLdExpenses } from "@/hooks/useLdExpenses";
import { useLdInventory } from "@/hooks/useLdInventory";
import { calculateStaffRevenueAllocation } from "@/hooks/useLdStaffRevenue";
import { useAllSharedAllocations } from "@/hooks/useLdSharedAllocations";
import { useLdSalaryConfigs } from "@/hooks/useLdSalaryConfig";
import { mergeLdSalaryConfigsWithStaff } from "@/lib/ld-salary-config";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Download, FileText, DollarSign, ClipboardList, Building2, Users, TrendingUp, TrendingDown, CalendarIcon } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths, startOfYear, endOfYear } from "date-fns";
import { cn } from "@/lib/utils";

const fmt = (v: number) => `₦${v.toLocaleString()}`;

function exportCSV(rows: any[], filename: string) {
  if (rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const csv = [headers.join(","), ...rows.map(r => headers.map(h => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
}

export default function LdReportsPage() {
  const { data: cases = [] } = useLdCases();
  const { data: invoices = [] } = useLdInvoices();
  const { data: payments = [] } = useLdPayments();
  const { data: clients = [] } = useLdClients();
  const { data: staff = [] } = useLdStaff();
  const { data: workTypes = [] } = useLdWorkTypes();
  const { data: creditNotes = [] } = useLdCreditNotes();
  const { data: expenses = [] } = useLdExpenses();
  const { data: inventory = [] } = useLdInventory();
  const { data: sharedAllocations = [] } = useAllSharedAllocations();

  const [period, setPeriod] = useState("6");
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), "yyyy-MM"));
  const [fiscalYear, setFiscalYear] = useState(new Date().getFullYear().toString());
  const [paidOnly, setPaidOnly] = useState(false);
  const [allocDateFrom, setAllocDateFrom] = useState<Date | undefined>();
  const [allocDateTo, setAllocDateTo] = useState<Date | undefined>();
  const months = Number(period);

  const selectedMonthStart = startOfMonth(new Date(selectedMonth + "-01"));
  const selectedMonthEnd = endOfMonth(selectedMonthStart);
  const fiscalYearStart = startOfYear(new Date(Number(fiscalYear), 0));
  const fiscalYearEnd = endOfYear(fiscalYearStart);
  const allocStart = allocDateFrom || selectedMonthStart;
  const allocEnd = allocDateTo || selectedMonthEnd;
  const allocStartKey = format(allocStart, "yyyy-MM-dd");
  const allocEndKey = format(allocEnd, "yyyy-MM-dd");
  const { data: salaryConfigs = [] } = useLdSalaryConfigs(allocStartKey, allocEndKey);
  const resolvedSalaryConfigs = useMemo(() => mergeLdSalaryConfigsWithStaff(staff, salaryConfigs), [staff, salaryConfigs]);

  // Monthly revenue data
  const monthlyData = useMemo(() => {
    const now = new Date();
    const intervals = eachMonthOfInterval({ start: subMonths(now, months - 1), end: now });
    return intervals.map(month => {
      const start = startOfMonth(month);
      const end = endOfMonth(month);
      const monthCases = cases.filter((c: any) => { const d = new Date(c.created_at); return d >= start && d <= end; });
      const monthInvoices = invoices.filter((i: any) => { const d = new Date(i.invoice_date); return d >= start && d <= end; });
      const monthPayments = payments.filter((p: any) => { const d = new Date(p.payment_date); return d >= start && d <= end; });
      const monthExpenses = expenses.filter((e: any) => { const d = new Date(e.expense_date); return d >= start && d <= end; });
      return {
        month: format(month, "MMM yy"),
        billed: monthInvoices.reduce((s: number, i: any) => s + Number(i.total_amount || 0), 0),
        collected: monthPayments.reduce((s: number, p: any) => s + Number(p.amount || 0), 0),
        expenses: monthExpenses.reduce((s: number, e: any) => s + Number(e.amount || 0), 0),
        cases: monthCases.length,
      };
    });
  }, [invoices, payments, cases, expenses, months]);

  // A. Work Type Report — unique by work_type_name, each case = 1 unit
  // Feature #3: Clear report based on WORK TYPE NAME only
  // Feature #5: Uses work_type_name, each case counts as 1 unit
  const workTypeReport = useMemo(() => {
    const monthCases = cases.filter((c: any) => {
      const d = new Date(c.created_at);
      return d >= selectedMonthStart && d <= selectedMonthEnd;
    });
    // Deduplicate by case id
    const seenIds = new Set<string>();
    const unique = monthCases.filter((c: any) => { if (seenIds.has(c.id)) return false; seenIds.add(c.id); return true; });
    
    const map: Record<string, { totalUnits: number; totalPrice: number; caseCount: number }> = {};
    unique.forEach((c: any) => {
      const name = c.work_type_name || "Unknown";
      const units = 1;
      const price = Number(c.net_amount || 0);
      if (!map[name]) map[name] = { totalUnits: 0, totalPrice: 0, caseCount: 0 };
      map[name].totalUnits += units;
      map[name].totalPrice += price;
      map[name].caseCount++;
    });
    return Object.entries(map).map(([name, data]) => ({
      name,
      ...data,
      avgPricePerUnit: data.totalUnits > 0 ? Math.round(data.totalPrice / data.totalUnits) : 0,
    })).sort((a, b) => b.totalUnits - a.totalUnits);
  }, [cases, selectedMonthStart, selectedMonthEnd]);

  // B. Monthly expenses
  const monthlyExpenses = useMemo(() => {
    return expenses.filter((e: any) => {
      const d = new Date(e.expense_date);
      return d >= selectedMonthStart && d <= selectedMonthEnd;
    });
  }, [expenses, selectedMonthStart, selectedMonthEnd]);

  const totalMonthExpenses = monthlyExpenses.reduce((s: number, e: any) => s + Number(e.amount), 0);

  // Expense category summary for selected month
  const expenseCategorySummary = useMemo(() => {
    const map: Record<string, number> = {};
    monthlyExpenses.forEach((e: any) => {
      const cat = e.category || "Uncategorized";
      map[cat] = (map[cat] || 0) + Number(e.amount || 0);
    });
    return Object.entries(map).map(([category, total]) => ({ category, total })).sort((a, b) => b.total - a.total);
  }, [monthlyExpenses]);

  // Fiscal year expense category summary
  const fiscalExpenseSummary = useMemo(() => {
    const yearExpenses = expenses.filter((e: any) => {
      const d = new Date(e.expense_date);
      return d >= fiscalYearStart && d <= fiscalYearEnd;
    });
    const map: Record<string, number> = {};
    yearExpenses.forEach((e: any) => {
      const cat = e.category || "Uncategorized";
      map[cat] = (map[cat] || 0) + Number(e.amount || 0);
    });
    const totalFiscal = yearExpenses.reduce((s: number, e: any) => s + Number(e.amount || 0), 0);
    return {
      categories: Object.entries(map).map(([category, total]) => ({ category, total })).sort((a, b) => b.total - a.total),
      total: totalFiscal,
    };
  }, [expenses, fiscalYearStart, fiscalYearEnd]);

  // C. Monthly client sales with case category breakdown
  const clientSalesReport = useMemo(() => {
    const monthCases = cases.filter((c: any) => {
      const d = new Date(c.created_at);
      return d >= selectedMonthStart && d <= selectedMonthEnd;
    });
    const monthPayments = payments.filter((p: any) => {
      const d = new Date(p.payment_date);
      return d >= selectedMonthStart && d <= selectedMonthEnd;
    });

    // Get unique work type names from month cases
    const allWorkTypes = [...new Set(monthCases.map((c: any) => c.work_type_name || "Unknown"))].sort();

    return {
      workTypes: allWorkTypes,
      rows: clients.map((client: any) => {
        const cCases = monthCases.filter((c: any) => c.client_id === client.id);
        const grossSale = cCases.reduce((s: number, c: any) => s + Number(c.lab_fee || 0), 0);
        const netSale = cCases.reduce((s: number, c: any) => s + Number(c.net_amount || 0), 0);
        // Payments: directly linked to client or via invoice
        const clientInvoiceIds = new Set(
          invoices.filter((i: any) => i.client_id === client.id).map((i: any) => i.id)
        );
        const cPayments = monthPayments.filter((p: any) =>
          p.client_id === client.id || clientInvoiceIds.has(p.invoice_id)
        );
        const totalPaid = cPayments.reduce((s: number, p: any) => s + Number(p.amount || 0), 0);
        // Work type breakdown
        const wtBreakdown: Record<string, number> = {};
        cCases.forEach((c: any) => {
          const wt = c.work_type_name || "Unknown";
          wtBreakdown[wt] = (wtBreakdown[wt] || 0) + 1;
        });
        return {
          name: client.clinic_name,
          code: client.clinic_code || "",
          grossSale,
          netSale,
          totalPaid,
          balance: Math.max(grossSale - totalPaid, 0),
          cases: cCases.length,
          wtBreakdown,
        };
      }).filter(c => c.cases > 0).sort((a, b) => b.netSale - a.netSale),
    };
  }, [cases, invoices, payments, clients, selectedMonthStart, selectedMonthEnd]);

  // E. Monthly sales by client - top 5 bold (with work type breakdown)
  const salesByClient = clientSalesReport;

  // F. Monthly sales by product - top 5 bold (uses workTypeReport)
  const salesByProduct = workTypeReport;

  const revenueAllocation = useMemo(() => {
    return calculateStaffRevenueAllocation(cases, staff, resolvedSalaryConfigs, allocStart, allocEnd, paidOnly, sharedAllocations);
  }, [cases, staff, resolvedSalaryConfigs, allocStart, allocEnd, paidOnly, sharedAllocations]);

  // D. P&L with Opening/Closing Stock
  const stockPnL = useMemo(() => {
    // Sales by work type
    const monthCases = cases.filter((c: any) => {
      const d = new Date(c.created_at);
      return d >= selectedMonthStart && d <= selectedMonthEnd;
    });
    const salesMap: Record<string, { units: number; total: number }> = {};
    monthCases.forEach((c: any) => {
      const name = c.work_type_name || "Unknown";
      if (!salesMap[name]) salesMap[name] = { units: 0, total: 0 };
      salesMap[name].units += 1;
      salesMap[name].total += Number(c.net_amount || 0);
    });
    const salesRows = Object.entries(salesMap).map(([name, d]) => ({ name, ...d })).sort((a, b) => b.total - a.total);
    const totalSales = salesRows.reduce((s, r) => s + r.total, 0);

    // Expenses for the month
    const mExpenses = expenses.filter((e: any) => {
      const d = new Date(e.expense_date);
      return d >= selectedMonthStart && d <= selectedMonthEnd;
    });
    const totalExpenses = mExpenses.reduce((s: number, e: any) => s + Number(e.amount), 0);

    // Opening stock = inventory values (approximation - sum of qty * estimated unit cost)
    const openingStock = inventory.reduce((s: number, item: any) => s + Number(item.quantity || 0), 0);
    const closingStock = openingStock; // Same snapshot — real tracking would need historical data

    return { salesRows, totalSales, totalExpenses, openingStock, closingStock };
  }, [cases, expenses, inventory, selectedMonthStart, selectedMonthEnd]);

  // Export
  const exportCases = () => {
    const rows = cases.map((c: any) => ({
      "Case #": c.case_number, Patient: c.patient_name, "Work Type": c.work_type_name,
      Status: c.status, "Lab Fee": c.lab_fee, Discount: c.discount, "Net Amount": c.net_amount,
      Technician: c.technician?.full_name || "", Client: c.client?.clinic_name || "",
    }));
    exportCSV(rows, `lab-cases-${format(new Date(), "yyyy-MM-dd")}.csv`);
  };

  const totalBilled = invoices.reduce((s: number, i: any) => s + Number(i.total_amount || 0), 0);
  const totalCollected = payments.reduce((s: number, p: any) => s + Number(p.amount || 0), 0);
  const totalExpensesAll = expenses.reduce((s: number, e: any) => s + Number(e.amount || 0), 0);
  const totalCreditsAmt = creditNotes.filter((cn: any) => cn.type === "credit").reduce((s: number, cn: any) => s + Number(cn.amount), 0);
  const totalMonthSales = workTypeReport.reduce((s, p) => s + p.totalPrice, 0);
  const totalMonthUnits = workTypeReport.reduce((s, p) => s + p.totalUnits, 0);
  const monthGrossProfit = totalMonthSales - totalMonthExpenses;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <PageHeader title="Reports & Analytics" description="Comprehensive lab reports, P&L, and staff allocation" />
        <div className="flex gap-2">
          <Input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="w-[160px]" />
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="3">Last 3 months</SelectItem>
              <SelectItem value="6">Last 6 months</SelectItem>
              <SelectItem value="12">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Total Billed", value: totalBilled, color: "" },
          { label: "Total Collected", value: totalCollected, color: "text-emerald-600" },
          { label: "Total Expenses", value: totalExpensesAll, color: "text-destructive" },
          { label: "Credits Issued", value: totalCreditsAmt, color: "text-amber-600" },
          { label: "Total Cases", value: cases.length, noFmt: true, color: "" },
        ].map(s => (
          <Card key={s.label} className="border-border/50"><CardContent className="p-4">
            <p className="text-[10px] text-muted-foreground uppercase">{s.label}</p>
            <p className={`text-xl font-bold ${s.color}`}>{s.noFmt ? s.value : fmt(s.value as number)}</p>
          </CardContent></Card>
        ))}
      </div>

      <Tabs defaultValue="pnl" className="space-y-4">
        <TabsList className="flex flex-wrap gap-1 h-auto p-1">
          <TabsTrigger value="pnl" className="text-xs whitespace-nowrap">Work Type</TabsTrigger>
          <TabsTrigger value="stock-pnl" className="text-xs whitespace-nowrap">P&L Stock</TabsTrigger>
          <TabsTrigger value="expenses" className="text-xs whitespace-nowrap">Expenses</TabsTrigger>
          <TabsTrigger value="client-sales" className="text-xs whitespace-nowrap">Client Sales</TabsTrigger>
          <TabsTrigger value="sales-client" className="text-xs whitespace-nowrap">By Client</TabsTrigger>
          <TabsTrigger value="sales-product" className="text-xs whitespace-nowrap">By Work Type</TabsTrigger>
          <TabsTrigger value="revenue-alloc" className="text-xs whitespace-nowrap">Revenue Alloc</TabsTrigger>
          <TabsTrigger value="charts" className="text-xs whitespace-nowrap">Trends</TabsTrigger>
          <TabsTrigger value="export" className="text-xs whitespace-nowrap">Export</TabsTrigger>
        </TabsList>

        {/* A. Work Type Report — Feature #3 & #5 */}
        <TabsContent value="pnl">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Work Type Report — {format(selectedMonthStart, "MMMM yyyy")}</CardTitle>
              <CardDescription>Revenue by Work Type Name with unit count (no duplication)</CardDescription>
            </CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <thead><tr className="border-b bg-muted/30">
                  <th className="text-left p-3 font-medium text-muted-foreground">Work Type</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Cases</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Total Units</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Total Price (₦)</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Avg / Unit</th>
                </tr></thead>
                <tbody>
                  {workTypeReport.map(p => (
                    <tr key={p.name} className="border-b border-border/30">
                      <td className="p-3 font-medium">{p.name}</td>
                      <td className="p-3 text-right">{p.caseCount}</td>
                      <td className="p-3 text-right">{p.totalUnits}</td>
                      <td className="p-3 text-right text-emerald-600">{fmt(p.totalPrice)}</td>
                      <td className="p-3 text-right text-muted-foreground">{fmt(p.avgPricePerUnit)}</td>
                    </tr>
                  ))}
                  {workTypeReport.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No data for this month</td></tr>}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-border font-semibold">
                    <td className="p-3">Totals</td>
                    <td className="p-3 text-right">{workTypeReport.reduce((s, p) => s + p.caseCount, 0)}</td>
                    <td className="p-3 text-right">{totalMonthUnits}</td>
                    <td className="p-3 text-right text-emerald-600">{fmt(totalMonthSales)}</td>
                    <td className="p-3 text-right text-muted-foreground">{totalMonthUnits > 0 ? fmt(Math.round(totalMonthSales / totalMonthUnits)) : "—"}</td>
                  </tr>
                  <tr className="text-destructive">
                    <td className="p-3">Less: Expenses</td>
                    <td colSpan={3}></td>
                    <td className="p-3 text-right">-{fmt(totalMonthExpenses)}</td>
                  </tr>
                  <tr className="border-t-2 font-bold text-lg">
                    <td className="p-3">Net Profit / (Loss)</td>
                    <td colSpan={3}></td>
                    <td className={`p-3 text-right ${monthGrossProfit >= 0 ? "text-emerald-600" : "text-destructive"}`}>
                      {monthGrossProfit >= 0 ? fmt(monthGrossProfit) : `(${fmt(Math.abs(monthGrossProfit))})`}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* D. P&L with Opening/Closing Stock */}
        <TabsContent value="stock-pnl">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">P&L with Opening / Closing Stock — {format(selectedMonthStart, "MMMM yyyy")}</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <thead><tr className="border-b bg-muted/30">
                  <th className="text-left p-3 font-medium text-muted-foreground">Item</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Units</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Amount (₦)</th>
                </tr></thead>
                <tbody>
                  <tr className="border-b bg-emerald-500/5"><td colSpan={3} className="p-3 font-semibold text-emerald-700">Sales (+)</td></tr>
                  {stockPnL.salesRows.map(r => (
                    <tr key={r.name} className="border-b border-border/30">
                      <td className="p-3 pl-6">{r.name}</td>
                      <td className="p-3 text-right">{r.units}</td>
                      <td className="p-3 text-right text-emerald-600">{fmt(r.total)}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 font-semibold"><td className="p-3">Total Sales</td><td></td><td className="p-3 text-right text-emerald-600">{fmt(stockPnL.totalSales)}</td></tr>
                  <tr className="border-b bg-destructive/5"><td colSpan={3} className="p-3 font-semibold text-destructive">Less:</td></tr>
                  <tr className="border-b border-border/30"><td className="p-3 pl-6">Expenses</td><td></td><td className="p-3 text-right text-destructive">-{fmt(stockPnL.totalExpenses)}</td></tr>
                  <tr className="border-b border-border/30"><td className="p-3 pl-6">Opening Stock (units)</td><td className="p-3 text-right">{stockPnL.openingStock}</td><td className="p-3 text-right text-muted-foreground">—</td></tr>
                  <tr className="border-b border-border/30"><td className="p-3 pl-6">Closing Stock (units)</td><td className="p-3 text-right">{stockPnL.closingStock}</td><td className="p-3 text-right text-muted-foreground">—</td></tr>
                  <tr className="border-t-2 font-bold text-lg">
                    <td className="p-3">Net Profit / (Loss)</td><td></td>
                    <td className={`p-3 text-right ${stockPnL.totalSales - stockPnL.totalExpenses >= 0 ? "text-emerald-600" : "text-destructive"}`}>
                      {stockPnL.totalSales - stockPnL.totalExpenses >= 0 ? fmt(stockPnL.totalSales - stockPnL.totalExpenses) : `(${fmt(Math.abs(stockPnL.totalSales - stockPnL.totalExpenses))})`}
                    </td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* B. Monthly Expenses with Category Summary */}
        <TabsContent value="expenses">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Monthly Expenses — {format(selectedMonthStart, "MMMM yyyy")}</CardTitle>
              <CardDescription>Total: {fmt(totalMonthExpenses)}</CardDescription>
            </CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <thead><tr className="border-b bg-muted/30">
                  <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Category</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Vendor</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Description</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Amount</th>
                </tr></thead>
                <tbody>
                  {monthlyExpenses.map((e: any) => (
                    <tr key={e.id} className="border-b border-border/30">
                      <td className="p-3 text-xs">{format(new Date(e.expense_date), "MMM d")}</td>
                      <td className="p-3 capitalize text-xs">{e.category?.replace("_", " ")}</td>
                      <td className="p-3">{e.vendor || "—"}</td>
                      <td className="p-3 text-xs">{e.description || "—"}</td>
                      <td className="p-3 text-right font-medium text-destructive">{fmt(Number(e.amount))}</td>
                    </tr>
                  ))}
                  {monthlyExpenses.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No expenses this month</td></tr>}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 font-semibold">
                    <td colSpan={4} className="p-3">Total</td>
                    <td className="p-3 text-right text-destructive">{fmt(totalMonthExpenses)}</td>
                  </tr>
                </tfoot>
              </table>
            </CardContent>
          </Card>

          {/* Category Summary for the month */}
          {expenseCategorySummary.length > 0 && (
            <Card className="border-border/50 mt-4">
              <CardHeader>
                <CardTitle className="text-base">Expense Summary by Category — {format(selectedMonthStart, "MMMM yyyy")}</CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full text-sm">
                  <thead><tr className="border-b bg-muted/30">
                    <th className="text-left p-3 font-medium text-muted-foreground">Category</th>
                    <th className="text-right p-3 font-medium text-muted-foreground">Total (₦)</th>
                  </tr></thead>
                  <tbody>
                    {expenseCategorySummary.map(c => (
                      <tr key={c.category} className="border-b border-border/30">
                        <td className="p-3 capitalize">{c.category.replace(/_/g, " ")}</td>
                        <td className="p-3 text-right font-medium text-destructive">{fmt(c.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 font-semibold">
                      <td className="p-3">Total</td>
                      <td className="p-3 text-right text-destructive">{fmt(totalMonthExpenses)}</td>
                    </tr>
                  </tfoot>
                </table>
              </CardContent>
            </Card>
          )}

          {/* Fiscal Year Summary */}
          <Card className="border-border/50 mt-4">
            <CardHeader>
              <div className="flex items-center gap-3">
                <CardTitle className="text-base">Fiscal Year Expense Summary</CardTitle>
                <Select value={fiscalYear} onValueChange={setFiscalYear}>
                  <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[2024, 2025, 2026, 2027].map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <CardDescription>Total: {fmt(fiscalExpenseSummary.total)} for {fiscalYear}</CardDescription>
            </CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <thead><tr className="border-b bg-muted/30">
                  <th className="text-left p-3 font-medium text-muted-foreground">Category</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Yearly Total (₦)</th>
                </tr></thead>
                <tbody>
                  {fiscalExpenseSummary.categories.map(c => (
                    <tr key={c.category} className="border-b border-border/30">
                      <td className="p-3 capitalize">{c.category.replace(/_/g, " ")}</td>
                      <td className="p-3 text-right font-medium text-destructive">{fmt(c.total)}</td>
                    </tr>
                  ))}
                  {fiscalExpenseSummary.categories.length === 0 && <tr><td colSpan={2} className="p-8 text-center text-muted-foreground">No expenses for {fiscalYear}</td></tr>}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 font-semibold">
                    <td className="p-3">Total</td>
                    <td className="p-3 text-right text-destructive">{fmt(fiscalExpenseSummary.total)}</td>
                  </tr>
                </tfoot>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* C. Client Sales / Profit with case category breakdown */}
        <TabsContent value="client-sales">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Client Sales & Profit — {format(selectedMonthStart, "MMMM yyyy")}</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b bg-muted/30">
                  <th className="text-left p-3 font-medium text-muted-foreground">Client</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Cases</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Gross Sale</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Net Sale</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Paid</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Balance</th>
                  {clientSalesReport.workTypes.map(wt => (
                    <th key={wt} className="text-right p-3 font-medium text-muted-foreground text-xs">{wt}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {clientSalesReport.rows.map((c, idx) => (
                    <tr key={c.name} className={`border-b border-border/30 ${idx < 5 ? "font-bold" : ""}`}>
                      <td className="p-3">{c.code ? `[${c.code}] ` : ""}{c.name}</td>
                      <td className="p-3 text-right">{c.cases}</td>
                      <td className="p-3 text-right">{fmt(c.grossSale)}</td>
                      <td className="p-3 text-right">{fmt(c.netSale)}</td>
                      <td className="p-3 text-right text-emerald-600">{fmt(c.totalPaid)}</td>
                      <td className="p-3 text-right text-destructive">{fmt(c.balance)}</td>
                      {clientSalesReport.workTypes.map(wt => (
                        <td key={wt} className="p-3 text-right text-xs">{c.wtBreakdown[wt] || "—"}</td>
                      ))}
                    </tr>
                  ))}
                  {clientSalesReport.rows.length === 0 && <tr><td colSpan={6 + clientSalesReport.workTypes.length} className="p-8 text-center text-muted-foreground">No data</td></tr>}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* E. Sales by Client - Top 5 bold */}
        <TabsContent value="sales-client">
          <Card className="border-border/50">
            <CardHeader><CardTitle className="text-base">Monthly Sales by Client — Top 5 Highlighted</CardTitle></CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <thead><tr className="border-b bg-muted/30">
                  <th className="text-left p-3 font-medium text-muted-foreground">#</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Client</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Cases</th>
                  {salesByClient.workTypes.map(wt => (
                    <th key={wt} className="text-right p-3 font-medium text-muted-foreground text-xs">{wt}</th>
                  ))}
                  <th className="text-right p-3 font-medium text-muted-foreground">Net Sales</th>
                </tr></thead>
                <tbody>
                  {salesByClient.rows.map((c, idx) => (
                    <tr key={c.name} className={`border-b border-border/30 ${idx < 5 ? "font-bold bg-primary/5" : ""}`}>
                      <td className="p-3">{idx + 1}{idx < 5 && <Badge className="ml-1 text-[9px]">TOP</Badge>}</td>
                      <td className="p-3">{c.name}</td>
                      <td className="p-3 text-right">{c.cases}</td>
                      {salesByClient.workTypes.map(wt => (
                        <td key={wt} className="p-3 text-right text-xs">{c.wtBreakdown[wt] || "—"}</td>
                      ))}
                      <td className="p-3 text-right">{fmt(c.netSale)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* F. Sales by Work Type - Top 5 bold */}
        <TabsContent value="sales-product">
          <Card className="border-border/50">
            <CardHeader><CardTitle className="text-base">Monthly Sales by Work Type — Top 5 Highlighted</CardTitle></CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <thead><tr className="border-b bg-muted/30">
                  <th className="text-left p-3 font-medium text-muted-foreground">#</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Work Type</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Units</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Revenue</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Avg/Unit</th>
                </tr></thead>
                <tbody>
                  {salesByProduct.map((p, idx) => (
                    <tr key={p.name} className={`border-b border-border/30 ${idx < 5 ? "font-bold bg-primary/5" : ""}`}>
                      <td className="p-3">{idx + 1}{idx < 5 && <Badge className="ml-1 text-[9px]">TOP</Badge>}</td>
                      <td className="p-3">{p.name}</td>
                      <td className="p-3 text-right">{p.totalUnits}</td>
                      <td className="p-3 text-right">{fmt(p.totalPrice)}</td>
                      <td className="p-3 text-right text-muted-foreground">{fmt(p.avgPricePerUnit)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Revenue Allocation */}
        <TabsContent value="revenue-alloc">
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <CardTitle className="text-base">Staff Revenue Allocation {allocDateFrom && allocDateTo ? `— ${format(allocDateFrom, "MMM d")} to ${format(allocDateTo, "MMM d, yyyy")}` : `— ${format(selectedMonthStart, "MMMM yyyy")}`}</CardTitle>
                  <CardDescription>Uses each case work type price. Basic is fixed by staff percentages, technicians earn output by assigned units, manager/supervisor-style output roles earn by total assigned cases, and unassigned cases go to extras.</CardDescription>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className={cn("gap-1 text-xs", allocDateFrom && "border-primary text-primary")}>
                        <CalendarIcon className="h-3 w-3" />
                        {allocDateFrom ? format(allocDateFrom, "MMM d") : "From"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={allocDateFrom} onSelect={setAllocDateFrom} className="pointer-events-auto" /></PopoverContent>
                  </Popover>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className={cn("gap-1 text-xs", allocDateTo && "border-primary text-primary")}>
                        <CalendarIcon className="h-3 w-3" />
                        {allocDateTo ? format(allocDateTo, "MMM d") : "To"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={allocDateTo} onSelect={setAllocDateTo} className="pointer-events-auto" /></PopoverContent>
                  </Popover>
                  {(allocDateFrom || allocDateTo) && <Button variant="ghost" size="sm" className="text-xs" onClick={() => { setAllocDateFrom(undefined); setAllocDateTo(undefined); }}>Clear</Button>}
                  <Checkbox checked={paidOnly} onCheckedChange={(v) => setPaidOnly(!!v)} id="paid-only" />
                  <Label htmlFor="paid-only" className="text-xs cursor-pointer">Paid cases only</Label>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
                  <p className="text-[10px] text-muted-foreground uppercase">Staff Commission Base</p>
                  <p className="text-lg font-bold">{fmt(revenueAllocation.totalProductiveRevenue)}</p>
                </div>
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-[10px] text-muted-foreground uppercase">20% Output Base</p>
                  <p className="text-lg font-bold text-emerald-600">{fmt(revenueAllocation.outputPool)}</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <p className="text-[10px] text-muted-foreground uppercase">10% Basic Base</p>
                  <p className="text-lg font-bold text-blue-600">{fmt(revenueAllocation.basicPool)}</p>
                </div>
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <p className="text-[10px] text-muted-foreground uppercase">Assigned Cases</p>
                  <p className="text-lg font-bold text-amber-600">{revenueAllocation.totalJobs}</p>
                </div>
              </div>

              {(revenueAllocation.unassignedCasesCount > 0 || revenueAllocation.extrasTotal > 0) && (
                <div className="flex gap-4 text-xs flex-wrap">
                  <span className="text-muted-foreground">Unassigned cases: <span className="font-medium">{revenueAllocation.unassignedCasesCount}</span></span>
                  <span className="text-muted-foreground">Extras value: <span className="font-medium text-amber-600">{fmt(revenueAllocation.extrasTotal)}</span></span>
                </div>
              )}

              {revenueAllocation.courierTotal > 0 || revenueAllocation.expressTotal > 0 ? (
                <div className="flex gap-4 text-xs">
                  {revenueAllocation.courierTotal > 0 && (
                    <span className="text-muted-foreground">Courier charges (→ Expenses): <span className="font-medium text-destructive">{fmt(revenueAllocation.courierTotal)}</span></span>
                  )}
                  {revenueAllocation.expressTotal > 0 && (
                    <span className="text-muted-foreground">Express charges (→ Savings): <span className="font-medium text-emerald-600">{fmt(revenueAllocation.expressTotal)}</span></span>
                  )}
                </div>
              ) : null}

              <table className="w-full text-sm">
                <thead><tr className="border-b bg-muted/30">
                  <th className="text-left p-3 font-medium text-muted-foreground">Staff</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Role</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Basic %</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Cases</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Units</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Jobs Revenue</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Output (20%)</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Basic (10%)</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Shared Debit</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Shared Bonus</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Help Needed</th>
                  <th className="text-right p-3 font-medium text-muted-foreground font-bold">Total</th>
                </tr></thead>
                <tbody>
                  {revenueAllocation.allocations.map(a => (
                    <tr key={a.staff_id} className="border-b border-border/30">
                      <td className="p-3 font-medium">{a.staff_name}</td>
                      <td className="p-3 capitalize text-xs">{a.role?.replace("_", " ")}</td>
                      <td className="p-3 text-right">{a.basic_percentage.toFixed(3)}%</td>
                      <td className="p-3 text-right">{a.jobs_count}</td>
                      <td className="p-3 text-right">{a.jobs_units || 0}</td>
                      <td className="p-3 text-right">{fmt(a.jobs_revenue)}</td>
                      <td className="p-3 text-right text-emerald-600">{fmt(a.output_allocation)}</td>
                      <td className="p-3 text-right text-blue-600">{fmt(a.basic_allocation)}</td>
                      <td className="p-3 text-right text-destructive">{a.shared_debit > 0 ? `-${fmt(a.shared_debit)}` : "—"}</td>
                      <td className="p-3 text-right text-emerald-600">{a.shared_credit > 0 ? `+${fmt(a.shared_credit)}` : "—"}</td>
                      <td className="p-3 text-right">
                        {a.shared_help_needed > 0 ? (
                          <span className={`font-medium ${a.shared_help_needed >= 3 ? "text-destructive" : "text-amber-600"}`}>
                            {a.shared_help_needed}× {a.shared_help_needed >= 3 ? "⚠️" : ""}
                          </span>
                        ) : "—"}
                      </td>
                      <td className="p-3 text-right font-bold">{fmt(a.total_allocation)}</td>
                    </tr>
                  ))}
                  {revenueAllocation.allocations.length === 0 && (
                    <tr><td colSpan={12} className="p-8 text-center text-muted-foreground">No allocation data for this period</td></tr>
                  )}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 font-semibold">
                    <td colSpan={8} className="p-3">Totals</td>
                    <td className="p-3 text-right text-destructive">{fmt(revenueAllocation.allocations.reduce((s, a) => s + (a.shared_debit || 0), 0))}</td>
                    <td className="p-3 text-right text-emerald-600">{fmt(revenueAllocation.allocations.reduce((s, a) => s + (a.shared_credit || 0), 0))}</td>
                    <td className="p-3 text-right">{revenueAllocation.allocations.reduce((s, a) => s + (a.shared_help_needed || 0), 0)}</td>
                    <td className="p-3 text-right font-bold">{fmt(revenueAllocation.allocations.reduce((s, a) => s + a.total_allocation, 0))}</td>
                  </tr>
                </tfoot>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Charts */}
        <TabsContent value="charts">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-border/50">
              <CardHeader><CardTitle className="text-base">Revenue vs Expenses Trend</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Line type="monotone" dataKey="billed" stroke="hsl(var(--primary))" strokeWidth={2} name="Billed" />
                    <Line type="monotone" dataKey="collected" stroke="#10b981" strokeWidth={2} name="Collected" />
                    <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="Expenses" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardHeader><CardTitle className="text-base">Cases per Month</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Bar dataKey="cases" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Export */}
        <TabsContent value="export">
          <Card className="border-border/50">
            <CardHeader><CardTitle className="text-base">Export Data</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button variant="outline" onClick={exportCases} className="h-auto py-4 flex-col gap-2">
                  <ClipboardList className="h-5 w-5" /><span className="text-xs">Export Cases</span>
                </Button>
                <Button variant="outline" onClick={() => {
                  const rows = invoices.map((i: any) => ({ "Invoice #": i.invoice_number, Date: i.invoice_date, Patient: i.patient_name || "", Total: i.total_amount, Paid: i.amount_paid, Status: i.status }));
                  exportCSV(rows, `lab-invoices-${format(new Date(), "yyyy-MM-dd")}.csv`);
                }} className="h-auto py-4 flex-col gap-2">
                  <FileText className="h-5 w-5" /><span className="text-xs">Export Invoices</span>
                </Button>
                <Button variant="outline" onClick={() => {
                  const rows = expenses.map((e: any) => ({ Date: e.expense_date, Category: e.category, Vendor: e.vendor, Description: e.description, Amount: e.amount }));
                  exportCSV(rows, `lab-expenses-${format(new Date(), "yyyy-MM-dd")}.csv`);
                }} className="h-auto py-4 flex-col gap-2">
                  <TrendingDown className="h-5 w-5" /><span className="text-xs">Export Expenses</span>
                </Button>
                <Button variant="outline" onClick={() => {
                  const rows = clientSalesReport.rows.map(c => ({ Client: c.name, Cases: c.cases, "Gross Sale": c.grossSale, "Net Sale": c.netSale, Paid: c.totalPaid }));
                  exportCSV(rows, `client-sales-${format(new Date(), "yyyy-MM-dd")}.csv`);
                }} className="h-auto py-4 flex-col gap-2">
                  <Building2 className="h-5 w-5" /><span className="text-xs">Export Client Sales</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
