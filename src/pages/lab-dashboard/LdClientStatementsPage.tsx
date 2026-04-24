import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useLdClients, useLdInvoices, useLdCases, useLdPayments } from "@/hooks/useLabDashboard";
import { useLdCreditNotes } from "@/hooks/useLdCaseExtras";
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";
import { motion } from "framer-motion";
import { Building2, DollarSign, TrendingDown, Download } from "lucide-react";

const fmt = (v: number) => `₦${v.toLocaleString()}`;

function exportCSV(rows: any[], filename: string) {
  if (rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const csv = [headers.join(","), ...rows.map(r => headers.map(h => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
}

export default function LdClientStatementsPage() {
  const navigate = useNavigate();
  const { data: clients = [] } = useLdClients();
  const { data: invoices = [] } = useLdInvoices();
  const { data: cases = [] } = useLdCases();
  const { data: payments = [] } = useLdPayments();
  const { data: creditNotes = [] } = useLdCreditNotes();
  const [selectedClientId, setSelectedClientId] = useState("all");
  const [periodType, setPeriodType] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), "yyyy-MM"));
  const [fiscalYear, setFiscalYear] = useState(new Date().getFullYear().toString());

  // Period filtering
  const periodStart = useMemo(() => {
    if (periodType === "monthly") return startOfMonth(new Date(selectedMonth + "-01"));
    if (periodType === "fiscal") return startOfYear(new Date(Number(fiscalYear), 0));
    return null;
  }, [periodType, selectedMonth, fiscalYear]);

  const periodEnd = useMemo(() => {
    if (periodType === "monthly") return endOfMonth(new Date(selectedMonth + "-01"));
    if (periodType === "fiscal") return endOfYear(new Date(Number(fiscalYear), 0));
    return null;
  }, [periodType, selectedMonth, fiscalYear]);

  const filterByPeriod = (dateStr: string) => {
    if (!periodStart || !periodEnd) return true;
    const d = new Date(dateStr);
    return d >= periodStart && d <= periodEnd;
  };

  const clientStatements = useMemo(() => {
    return clients.map((client: any) => {
      const clientInvoices = invoices.filter((i: any) => i.client_id === client.id && filterByPeriod(i.invoice_date));
      const clientCases = cases.filter((c: any) => c.client_id === client.id && filterByPeriod(c.created_at));
      const clientCredits = creditNotes.filter((cn: any) => cn.client_id === client.id && filterByPeriod(cn.created_at));
      const clientInvoiceIds = new Set(clientInvoices.map((i: any) => i.id));
      // Include payments linked to this client directly or via invoice
      const clientPayments = payments.filter((p: any) => {
        const matchClient = p.client_id === client.id || clientInvoiceIds.has(p.invoice_id);
        return matchClient && filterByPeriod(p.payment_date || p.created_at);
      });

      const totalBilled = clientInvoices.reduce((s: number, i: any) => s + Number(i.total_amount || 0), 0);
      // Use actual payments sum instead of invoice amount_paid to capture deposits properly
      const totalPaid = clientPayments.reduce((s: number, p: any) => s + Number(p.amount || 0), 0);
      const totalCredits = clientCredits.filter((cn: any) => cn.type === "credit").reduce((s: number, cn: any) => s + Number(cn.amount || 0), 0);
      const totalDebits = clientCredits.filter((cn: any) => cn.type === "debit").reduce((s: number, cn: any) => s + Number(cn.amount || 0), 0);
      const balance = totalBilled - totalPaid - totalCredits + totalDebits;

      return {
        ...client,
        totalCases: clientCases.length,
        totalInvoices: clientInvoices.length,
        totalBilled,
        totalPaid,
        totalCredits,
        totalDebits,
        balance: Math.max(balance, 0),
        invoices: clientInvoices,
        payments: clientPayments,
      };
    }).sort((a: any, b: any) => b.balance - a.balance);
  }, [clients, invoices, cases, payments, creditNotes, periodStart, periodEnd]);

  const filtered = selectedClientId === "all" ? clientStatements : clientStatements.filter((c: any) => c.id === selectedClientId);
  const totalOutstanding = clientStatements.reduce((s: number, c: any) => s + c.balance, 0);
  const totalBilledAll = clientStatements.reduce((s: number, c: any) => s + c.totalBilled, 0);
  const totalPaidAll = clientStatements.reduce((s: number, c: any) => s + c.totalPaid, 0);

  const handleExport = () => {
    const rows = filtered.map((c: any) => ({
      Clinic: c.clinic_name,
      Doctor: c.doctor_name,
      Code: c.clinic_code || "",
      "Total Cases": c.totalCases,
      "Total Billed": c.totalBilled,
      "Total Paid": c.totalPaid,
      Credits: c.totalCredits,
      Debits: c.totalDebits,
      "Outstanding Balance": c.balance,
    }));
    exportCSV(rows, `client-statements-${format(new Date(), "yyyy-MM-dd")}.csv`);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Client Statements" description="Account-wide balances and transaction history per client" />

      <div className="grid grid-cols-3 gap-4">
        <Card className="border-border/50"><CardContent className="p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-primary/10"><DollarSign className="h-5 w-5 text-primary" /></div>
          <div><p className="text-[10px] text-muted-foreground uppercase">Total Billed</p><p className="text-lg font-bold">{fmt(totalBilledAll)}</p></div>
        </CardContent></Card>
        <Card className="border-border/50"><CardContent className="p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-emerald-500/10"><DollarSign className="h-5 w-5 text-emerald-500" /></div>
          <div><p className="text-[10px] text-muted-foreground uppercase">Total Collected</p><p className="text-lg font-bold">{fmt(totalPaidAll)}</p></div>
        </CardContent></Card>
        <Card className="border-border/50"><CardContent className="p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-destructive/10"><TrendingDown className="h-5 w-5 text-destructive" /></div>
          <div><p className="text-[10px] text-muted-foreground uppercase">Outstanding</p><p className="text-lg font-bold text-destructive">{fmt(totalOutstanding)}</p></div>
        </CardContent></Card>
      </div>

      <div className="flex gap-3 items-center flex-wrap">
        <Select value={selectedClientId} onValueChange={setSelectedClientId}>
          <SelectTrigger className="w-[250px]"><SelectValue placeholder="All Clients" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Clients</SelectItem>
            {clients.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.clinic_code ? `[${c.clinic_code}] ` : ""}{c.clinic_name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={periodType} onValueChange={setPeriodType}>
          <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="fiscal">Fiscal Year</SelectItem>
          </SelectContent>
        </Select>
        {periodType === "monthly" && (
          <Input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="w-[160px]" />
        )}
        {periodType === "fiscal" && (
          <Select value={fiscalYear} onValueChange={setFiscalYear}>
            <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {[2024, 2025, 2026, 2027].map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
            </SelectContent>
          </Select>
        )}
        <Button variant="outline" size="sm" onClick={handleExport}><Download className="h-4 w-4 mr-1" /> Export CSV</Button>
      </div>

      <div className="space-y-4">
        {filtered.map((client: any) => (
          <motion.div key={client.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{client.clinic_name}</CardTitle>
                      <CardDescription className="text-xs">Dr. {client.doctor_name} {client.clinic_code && `• Code: ${client.clinic_code}`}</CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Balance</p>
                    <p className={`text-lg font-bold ${client.balance > 0 ? "text-destructive" : "text-emerald-600"}`}>
                      {fmt(client.balance)}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-4 text-center border-t border-border/30 pt-3">
                  <div>
                    <p className="text-[10px] text-muted-foreground">Cases</p>
                    <button
                      onClick={() => navigate(`/lab-dashboard/cases?client=${client.id}`)}
                      className="text-sm font-semibold text-primary hover:underline cursor-pointer"
                    >
                      {client.totalCases}
                    </button>
                  </div>
                  <div><p className="text-[10px] text-muted-foreground">Billed</p><p className="text-sm font-semibold">{fmt(client.totalBilled)}</p></div>
                  <div><p className="text-[10px] text-muted-foreground">Paid</p><p className="text-sm font-semibold text-emerald-600">{fmt(client.totalPaid)}</p></div>
                  <div><p className="text-[10px] text-muted-foreground">Credits</p><p className="text-sm font-semibold">{fmt(client.totalCredits)}</p></div>
                  <div><p className="text-[10px] text-muted-foreground">Invoices</p><p className="text-sm font-semibold">{client.totalInvoices}</p></div>
                </div>

                {client.invoices.length > 0 && (
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead><tr className="border-b border-border/30 text-muted-foreground">
                        <th className="text-left p-2">Invoice #</th><th className="text-left p-2">Date</th>
                        <th className="text-right p-2">Total</th><th className="text-right p-2">Paid</th>
                        <th className="text-right p-2">Balance</th><th className="text-center p-2">Status</th>
                      </tr></thead>
                      <tbody>
                        {client.invoices.map((inv: any) => (
                          <tr key={inv.id} className="border-b border-border/20">
                            <td className="p-2 font-mono">{inv.invoice_number}</td>
                            <td className="p-2">{inv.invoice_date}</td>
                            <td className="p-2 text-right">{fmt(Number(inv.total_amount))}</td>
                            <td className="p-2 text-right">{fmt(Number(inv.amount_paid))}</td>
                            <td className="p-2 text-right font-medium">{fmt(Math.max(Number(inv.total_amount) - Number(inv.amount_paid), 0))}</td>
                            <td className="p-2 text-center"><Badge variant="outline" className="text-[10px] capitalize">{inv.status}</Badge></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
        {filtered.length === 0 && <p className="text-center py-10 text-muted-foreground">No clients found</p>}
      </div>
    </div>
  );
}
