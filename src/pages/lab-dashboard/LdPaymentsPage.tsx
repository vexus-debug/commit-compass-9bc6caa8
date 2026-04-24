import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Search, Pencil } from "lucide-react";
import { useLdPayments, useCreateLdPayment, useUpdateLdPayment, useLdInvoices, useLdClients } from "@/hooks/useLabDashboard";
import { useAuth } from "@/hooks/useAuth";
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths } from "date-fns";

export default function LdPaymentsPage() {
  const { data: payments = [], isLoading } = useLdPayments();
  const { data: invoices = [] } = useLdInvoices();
  const { data: clients = [] } = useLdClients();
  const createPayment = useCreateLdPayment();
  const updatePayment = useUpdateLdPayment();
  const { roles } = useAuth();
  const isAdmin = roles.includes("admin") || roles.includes("lab_manager");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState("all");
  const [noInvoice, setNoInvoice] = useState(false);

  // Search & filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClient, setFilterClient] = useState("all");
  const [filterPeriod, setFilterPeriod] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), "yyyy-MM"));
  const [fiscalYear, setFiscalYear] = useState(new Date().getFullYear().toString());

  // Edit dialog
  const [editPayment, setEditPayment] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);

  const unpaidInvoices = useMemo(() => {
    return invoices.filter((i: any) => {
      const isUnpaid = i.status !== "paid";
      const matchClient = selectedClientId === "all" || i.client_id === selectedClientId;
      return isUnpaid && matchClient;
    });
  }, [invoices, selectedClientId]);

  const clientsById = useMemo(() => {
    return new Map(clients.map((client: any) => [client.id, client]));
  }, [clients]);

  // Filter & sort payments
  const filteredPayments = useMemo(() => {
    let result = [...payments];

    // Search by client name or reference
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter((p: any) => {
        const resolvedClientId = p.client_id || p.invoice?.client_id;
        const resolvedClient = resolvedClientId ? clientsById.get(resolvedClientId) : null;
        const clientName = p.client?.clinic_name || resolvedClient?.clinic_name || "";
        return clientName.toLowerCase().includes(term) ||
          (p.reference || "").toLowerCase().includes(term) ||
          (p.invoice?.invoice_number || "").toLowerCase().includes(term);
      });
    }

    // Filter by client
    if (filterClient !== "all") {
      result = result.filter((p: any) => {
        const resolvedClientId = p.client_id || p.invoice?.client_id;
        return resolvedClientId === filterClient;
      });
    }

    // Filter by period
    if (filterPeriod === "month") {
      const mStart = startOfMonth(new Date(selectedMonth + "-01"));
      const mEnd = endOfMonth(mStart);
      result = result.filter((p: any) => {
        const d = new Date(p.payment_date);
        return d >= mStart && d <= mEnd;
      });
    } else if (filterPeriod === "year") {
      const yStart = startOfYear(new Date(Number(fiscalYear), 0));
      const yEnd = endOfYear(yStart);
      result = result.filter((p: any) => {
        const d = new Date(p.payment_date);
        return d >= yStart && d <= yEnd;
      });
    }

    // Sort by payment_date descending (most recent first)
    result.sort((a: any, b: any) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime());

    return result;
  }, [payments, searchTerm, filterClient, filterPeriod, selectedMonth, fiscalYear, clientsById]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const invoiceId = noInvoice ? null : (fd.get("invoice_id") as string);
    if (!noInvoice && !invoiceId) return;
    const values: Record<string, unknown> = {
      amount: Number(fd.get("amount") || 0),
      payment_method: fd.get("payment_method") as string,
      payment_date: (fd.get("payment_date") as string) || new Date().toISOString().split("T")[0],
      reference: fd.get("reference") as string,
      remark: fd.get("remark") as string,
    };
    if (invoiceId) values.invoice_id = invoiceId;
    if (noInvoice && selectedClientId !== "all") values.client_id = selectedClientId;
    createPayment.mutate(values, { onSuccess: () => { setDialogOpen(false); setSelectedClientId("all"); setNoInvoice(false); } });
  };

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editPayment) return;
    const fd = new FormData(e.currentTarget);
    updatePayment.mutate({
      id: editPayment.id,
      amount: Number(fd.get("amount") || 0),
      payment_method: fd.get("payment_method") as string,
      payment_date: fd.get("payment_date") as string,
      reference: fd.get("reference") as string,
      remark: fd.get("remark") as string,
    }, { onSuccess: () => { setEditOpen(false); setEditPayment(null); } });
  };

  const monthOptions = useMemo(() => {
    const opts = [];
    for (let i = 0; i < 24; i++) {
      const d = subMonths(new Date(), i);
      opts.push({ value: format(d, "yyyy-MM"), label: format(d, "MMMM yyyy") });
    }
    return opts;
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payments</h1>
          <p className="text-sm text-muted-foreground">Impression n Teeth — Payment tracking</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) { setSelectedClientId("all"); setNoInvoice(false); } }}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-1" /> Record Payment</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Record Payment</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <Label>Step 1: Filter by Clinic / Client (optional)</Label>
                <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                  <SelectTrigger><SelectValue placeholder="All clients" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Clients</SelectItem>
                    {clients.map((c: any) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.clinic_code ? `[${c.clinic_code}] ` : ""}{c.clinic_name} — {c.doctor_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[10px] text-muted-foreground mt-0.5">Narrow down the invoice list by selecting a client first</p>
              </div>
              <div>
                <Label>Step 2: Select Invoice to Pay</Label>
                <div className="flex items-center gap-2 my-1.5">
                  <Checkbox id="no-invoice" checked={noInvoice} onCheckedChange={(v) => setNoInvoice(!!v)} />
                  <label htmlFor="no-invoice" className="text-sm text-muted-foreground cursor-pointer">Record payment without an invoice</label>
                </div>
                {!noInvoice && (
                  <>
                    <select name="invoice_id" required className="w-full border rounded-md p-2 text-sm bg-background">
                      <option value="">— Choose an unpaid invoice —</option>
                      {unpaidInvoices.length === 0 && <option disabled>No unpaid invoices{selectedClientId !== "all" ? " for this client" : ""}</option>}
                      {unpaidInvoices.map((i: any) => (
                        <option key={i.id} value={i.id}>
                          {i.invoice_number} — {i.client?.clinic_name || i.patient_name || "Unknown"} — ₦{Number(i.total_amount - i.amount_paid).toLocaleString()} outstanding
                        </option>
                      ))}
                    </select>
                    <p className="text-[10px] text-muted-foreground mt-0.5">This payment will be allocated against the selected invoice</p>
                  </>
                )}
                {noInvoice && (
                  <p className="text-[10px] text-muted-foreground mt-0.5">Payment will be recorded without linking to any invoice</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Amount (₦) *</Label><Input name="amount" type="number" step="0.01" required /></div>
                <div>
                  <Label>Method</Label>
                  <select name="payment_method" className="w-full border rounded-md p-2 text-sm bg-background">
                    <option value="cash">Cash</option>
                    <option value="transfer">Transfer</option>
                    <option value="card">Card</option>
                    <option value="cheque">Cheque</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Payment Date *</Label>
                  <Input name="payment_date" type="date" required defaultValue={new Date().toISOString().split("T")[0]} />
                  <p className="text-[10px] text-muted-foreground mt-0.5">Editable — backdate if needed</p>
                </div>
                <div><Label>Reference</Label><Input name="reference" /></div>
              </div>
              <div><Label>Remark</Label><Textarea name="remark" placeholder='e.g. "Payment actually received April 15"' rows={2} /></div>
              <Button type="submit" className="w-full" disabled={createPayment.isPending}>Record Payment</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-wrap gap-3 items-end">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search client, reference, invoice..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterClient} onValueChange={setFilterClient}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="All clients" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Clients</SelectItem>
            {clients.map((c: any) => (
              <SelectItem key={c.id} value={c.id}>
                {c.clinic_code ? `[${c.clinic_code}] ` : ""}{c.clinic_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterPeriod} onValueChange={setFilterPeriod}>
          <SelectTrigger className="w-[130px]"><SelectValue placeholder="All time" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="month">Monthly</SelectItem>
            <SelectItem value="year">Fiscal Year</SelectItem>
          </SelectContent>
        </Select>
        {filterPeriod === "month" && (
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[170px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {monthOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
            </SelectContent>
          </Select>
        )}
        {filterPeriod === "year" && (
          <Select value={fiscalYear} onValueChange={setFiscalYear}>
            <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {[2024, 2025, 2026, 2027].map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Total for filtered results */}
      {filteredPayments.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{filteredPayments.length}</span> payment(s) — Total: <span className="font-bold text-foreground">₦{filteredPayments.reduce((s: number, p: any) => s + Number(p.amount), 0).toLocaleString()}</span>
        </div>
      )}

      <Card className="border-border/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/30">
                  <th className="text-left p-3 font-medium text-muted-foreground">Client</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Invoice</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Payment Date</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Recorded</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Amount</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Method</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Reference</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Remark</th>
                  {isAdmin && <th className="text-right p-3 font-medium text-muted-foreground">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={isAdmin ? 9 : 8} className="p-8 text-center text-muted-foreground">Loading...</td></tr>
                ) : !filteredPayments.length ? (
                  <tr><td colSpan={isAdmin ? 9 : 8} className="p-8 text-center text-muted-foreground">No payments found</td></tr>
                ) : filteredPayments.map((p: any) => {
                  const resolvedClientId = p.client_id || p.invoice?.client_id;
                  const resolvedClient = resolvedClientId ? clientsById.get(resolvedClientId) : null;
                  const clientName = p.client?.clinic_name || resolvedClient?.clinic_name || "—";
                  return (
                    <tr key={p.id} className="border-b border-border/30 hover:bg-muted/20">
                      <td className="p-3 text-xs font-medium">{clientName}</td>
                      <td className="p-3 font-mono text-xs">{p.invoice?.invoice_number || "—"}</td>
                      <td className="p-3 text-xs">{format(new Date(p.payment_date), "MMM d, yyyy")}</td>
                      <td className="p-3 text-xs text-muted-foreground">{format(new Date(p.created_at), "MMM d, yyyy")}</td>
                      <td className="p-3 text-right font-medium">₦{Number(p.amount).toLocaleString()}</td>
                      <td className="p-3 capitalize">{p.payment_method}</td>
                      <td className="p-3 text-xs">{p.reference || "—"}</td>
                      <td className="p-3 text-xs text-muted-foreground">{p.remark || "—"}</td>
                      {isAdmin && (
                        <td className="p-3 text-right">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditPayment(p); setEditOpen(true); }}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Payment Dialog (Admin Only) */}
      <Dialog open={editOpen} onOpenChange={(o) => { setEditOpen(o); if (!o) setEditPayment(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Payment</DialogTitle></DialogHeader>
          {editPayment && (
            <form onSubmit={handleEditSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Amount (₦) *</Label><Input name="amount" type="number" step="0.01" required defaultValue={editPayment.amount} /></div>
                <div>
                  <Label>Method</Label>
                  <select name="payment_method" className="w-full border rounded-md p-2 text-sm bg-background" defaultValue={editPayment.payment_method}>
                    <option value="cash">Cash</option>
                    <option value="transfer">Transfer</option>
                    <option value="card">Card</option>
                    <option value="cheque">Cheque</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Payment Date *</Label><Input name="payment_date" type="date" required defaultValue={editPayment.payment_date} /></div>
                <div><Label>Reference</Label><Input name="reference" defaultValue={editPayment.reference || ""} /></div>
              </div>
              <div><Label>Remark</Label><Textarea name="remark" defaultValue={editPayment.remark || ""} rows={2} /></div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={updatePayment.isPending}>{updatePayment.isPending ? "Saving..." : "Save Changes"}</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
