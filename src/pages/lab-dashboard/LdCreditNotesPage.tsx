import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Plus, Search, FileText, Download } from "lucide-react";
import { useLdCreditNotes, useCreateLdCreditNote } from "@/hooks/useLdCaseExtras";
import { useLdClients, useLdInvoices, useLdCases } from "@/hooks/useLabDashboard";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { motion } from "framer-motion";

const fmt = (v: number) => `₦${v.toLocaleString()}`;

const REASONS = ["Remake required", "Damaged in transit", "Wrong shade", "Poor fit", "Client overcharged", "Goodwill discount", "Other"];

function exportCSV(rows: any[], filename: string) {
  if (rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const csv = [headers.join(","), ...rows.map(r => headers.map(h => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
}

export default function LdCreditNotesPage() {
  const { data: creditNotes = [], isLoading } = useLdCreditNotes();
  const createCreditNote = useCreateLdCreditNote();
  const { data: clients = [] } = useLdClients();
  const { data: invoices = [] } = useLdInvoices();
  const { data: cases = [] } = useLdCases();
  const { user } = useAuth();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filtered = creditNotes.filter((cn: any) => {
    const matchSearch = !search || cn.note_number?.toLowerCase().includes(search.toLowerCase()) || cn.reason?.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" || cn.type === filterType;
    return matchSearch && matchType;
  });

  const totalCredits = creditNotes.filter((cn: any) => cn.type === "credit").reduce((s: number, cn: any) => s + Number(cn.amount), 0);
  const totalDebits = creditNotes.filter((cn: any) => cn.type === "debit").reduce((s: number, cn: any) => s + Number(cn.amount), 0);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    createCreditNote.mutate({
      type: fd.get("type") as string,
      reason: fd.get("reason") as string,
      amount: Number(fd.get("amount")),
      client_id: fd.get("client_id") || null,
      invoice_id: fd.get("invoice_id") || null,
      case_id: fd.get("case_id") || null,
      created_by: user?.id,
    }, { onSuccess: () => setDialogOpen(false) });
  };

  const handleExport = () => {
    const rows = filtered.map((cn: any) => ({
      "Note #": cn.note_number,
      Type: cn.type,
      Reason: cn.reason,
      Amount: cn.amount,
      Client: cn.client?.clinic_name || "",
      Invoice: cn.invoice?.invoice_number || "",
      Case: cn.case?.case_number || "",
      Date: format(new Date(cn.created_at), "yyyy-MM-dd"),
    }));
    exportCSV(rows, `credit-notes-${format(new Date(), "yyyy-MM-dd")}.csv`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Credit & Debit Notes" description="Adjustments for remakes, returns, and corrections" />
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}><Download className="h-4 w-4 mr-1" /> Export</Button>
          <Button onClick={() => setDialogOpen(true)}><Plus className="h-4 w-4 mr-1" /> New Note</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="border-emerald-500/20"><CardContent className="p-4">
          <p className="text-xs text-muted-foreground">Total Credits Issued</p>
          <p className="text-xl font-bold text-emerald-600">{fmt(totalCredits)}</p>
        </CardContent></Card>
        <Card className="border-destructive/20"><CardContent className="p-4">
          <p className="text-xs text-muted-foreground">Total Debits Issued</p>
          <p className="text-xl font-bold text-destructive">{fmt(totalDebits)}</p>
        </CardContent></Card>
      </div>

      <div className="flex gap-3 items-center">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search notes..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="credit">Credits</SelectItem>
            <SelectItem value="debit">Debits</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="border-border/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border/50 bg-muted/30">
                <th className="text-left p-3 font-medium text-muted-foreground">Note #</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Type</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Reason</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Client</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Invoice</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Amount</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
              </tr></thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">Loading...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No credit/debit notes found</td></tr>
                ) : filtered.map((cn: any) => (
                  <motion.tr key={cn.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-border/30 hover:bg-muted/20">
                    <td className="p-3 font-mono text-xs">{cn.note_number}</td>
                    <td className="p-3">
                      <Badge className={cn.type === "credit" ? "bg-emerald-500/10 text-emerald-700" : "bg-destructive/10 text-destructive"}>
                        {cn.type}
                      </Badge>
                    </td>
                    <td className="p-3 text-xs">{cn.reason}</td>
                    <td className="p-3 text-xs">{cn.client?.clinic_name || "—"}</td>
                    <td className="p-3 text-xs font-mono">{cn.invoice?.invoice_number || "—"}</td>
                    <td className="p-3 text-right font-medium">{fmt(Number(cn.amount))}</td>
                    <td className="p-3 text-xs">{format(new Date(cn.created_at), "MMM d, yyyy")}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>New Credit / Debit Note</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Type *</Label>
              <select name="type" className="w-full border rounded-md p-2 text-sm bg-background" required>
                <option value="credit">Credit (Refund / Adjustment)</option>
                <option value="debit">Debit (Additional Charge)</option>
              </select>
            </div>
            <div>
              <Label>Reason *</Label>
              <select name="reason" className="w-full border rounded-md p-2 text-sm bg-background" required>
                {REASONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <Label>Amount (₦) *</Label>
              <Input name="amount" type="number" step="0.01" min={0} required />
            </div>
            <div>
              <Label>Client</Label>
              <select name="client_id" className="w-full border rounded-md p-2 text-sm bg-background">
                <option value="">None</option>
                {clients.map((c: any) => <option key={c.id} value={c.id}>{c.clinic_name}</option>)}
              </select>
            </div>
            <div>
              <Label>Invoice</Label>
              <select name="invoice_id" className="w-full border rounded-md p-2 text-sm bg-background">
                <option value="">None</option>
                {invoices.map((i: any) => <option key={i.id} value={i.id}>{i.invoice_number}</option>)}
              </select>
            </div>
            <div>
              <Label>Related Case</Label>
              <select name="case_id" className="w-full border rounded-md p-2 text-sm bg-background">
                <option value="">None</option>
                {cases.map((c: any) => <option key={c.id} value={c.id}>{c.case_number} — {c.patient_name}</option>)}
              </select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createCreditNote.isPending}>{createCreditNote.isPending ? "Creating..." : "Create Note"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
