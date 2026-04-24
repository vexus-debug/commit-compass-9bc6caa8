import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, DollarSign, TrendingUp, AlertCircle, MessageCircle, Printer, CalendarIcon } from "lucide-react";
import { useLdInvoices, useCreateLdInvoice, useUpdateLdInvoice, useLdCases, useLdClients, useLdSettings } from "@/hooks/useLabDashboard";
import { useBulkCreateLdInvoiceItems, useLdInvoiceItems } from "@/hooks/useLdInvoiceItems";
import { AnimatedCounter } from "@/components/dashboard/AnimatedCounter";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const statusColor: Record<string, string> = {
  unpaid: "bg-red-500/10 text-red-700 dark:text-red-400",
  partial: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  paid: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
};

const fmt = (v: number) => `₦${v.toLocaleString()}`;

function buildWhatsAppMessage(inv: any, labPhone?: string, labName?: string, isReminder?: boolean) {
  const balance = Number(inv.total_amount) - Number(inv.amount_paid);
  const lines = [
    `🏥 *${labName || "Impression n Teeth"}*`,
    isReminder ? `⏰ *PAYMENT REMINDER*` : `📄 *Invoice: ${inv.invoice_number}*`,
    ``,
    `🦷 Patient: ${inv.patient_name || "—"}`,
    `📅 Invoice Date: ${inv.invoice_date}`,
    inv.due_date ? `📆 Due Date: ${inv.due_date}` : null,
    ``,
    `💰 Subtotal: ${fmt(Number(inv.subtotal))}`,
    inv.discount > 0 ? `🏷️ Discount: ${fmt(Number(inv.discount))}` : null,
    `✅ Total: ${fmt(Number(inv.total_amount))}`,
    `💵 Paid: ${fmt(Number(inv.amount_paid))}`,
    `⚠️ Balance: ${fmt(balance)}`,
    ``,
    `Status: ${inv.status.toUpperCase()}`,
    isReminder ? `\n🔔 This is a friendly reminder that payment is due. Please arrange payment at your earliest convenience.` : null,
    inv.notes ? `📝 Notes: ${inv.notes}` : null,
  ].filter(Boolean).join("\n");
  const encoded = encodeURIComponent(lines);
  const phone = labPhone ? labPhone.replace(/\D/g, "") : "";
  return phone ? `https://wa.me/${phone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
}

function PrintableInvoice({ inv, labName, items }: { inv: any; labName: string; items: any[] }) {
  const balance = Number(inv.total_amount) - Number(inv.amount_paid);
  const deposit = Number(inv.deposit_amount || 0);
  return (
    <div className="p-6 space-y-4 text-sm print:text-xs">
      <div className="text-center border-b pb-3">
        <h2 className="text-lg font-bold">{labName}</h2>
        <p className="text-muted-foreground">Invoice: {inv.invoice_number}</p>
        {inv.date_from && inv.date_to && (
          <p className="text-xs text-muted-foreground">Period: {inv.date_from} to {inv.date_to}</p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div><span className="text-muted-foreground">Patient:</span> {inv.patient_name || "—"}</div>
        <div><span className="text-muted-foreground">Invoice Date:</span> {inv.invoice_date}</div>
        <div><span className="text-muted-foreground">Client:</span> {inv.client?.clinic_name || "—"}</div>
        <div><span className="text-muted-foreground">Due Date:</span> {inv.due_date || "—"}</div>
        <div><span className="text-muted-foreground">Case #:</span> {inv.case?.case_number || "—"}</div>
        <div><span className="text-muted-foreground">Status:</span> {inv.status}</div>
      </div>
      <table className="w-full border">
        <thead><tr className="bg-muted/50">
          <th className="border p-2 text-left">Date In</th>
          <th className="border p-2 text-left">Code</th>
          <th className="border p-2 text-left">Px Name</th>
          <th className="border p-2 text-left">Job Description</th>
          <th className="border p-2 text-right">Unit</th>
          <th className="border p-2 text-right">Price</th>
          <th className="border p-2 text-right">Total</th>
        </tr></thead>
        <tbody>
          {items.length > 0 ? items.map((item: any, idx: number) => (
            <tr key={idx}>
              <td className="border p-2 text-xs">{item.date_in || "—"}</td>
              <td className="border p-2 text-xs">{item.code}</td>
              <td className="border p-2">{item.patient_name}</td>
              <td className="border p-2">{item.job_description}</td>
              <td className="border p-2 text-right">{item.units}</td>
              <td className="border p-2 text-right">{fmt(Number(item.unit_price))}</td>
              <td className="border p-2 text-right">{fmt(Number(item.total_cost))}</td>
            </tr>
          )) : (
            <tr>
              <td className="border p-2" colSpan={4}>{inv.case?.case_number ? `Case ${inv.case.case_number}` : "Lab Service"}{inv.notes ? ` — ${inv.notes}` : ""}</td>
              <td className="border p-2 text-right">1</td>
              <td className="border p-2 text-right">{fmt(Number(inv.subtotal))}</td>
              <td className="border p-2 text-right">{fmt(Number(inv.subtotal))}</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="space-y-1 text-right">
        <p className="font-bold">TOTAL NET: {fmt(Number(inv.total_amount))}</p>
        {Number(inv.discount) > 0 && <p>Discount: -{fmt(Number(inv.discount))} <span className="text-xs text-muted-foreground">({inv.invoice_date})</span></p>}
        {deposit > 0 && <p>Deposit: -{fmt(deposit)} <span className="text-xs text-muted-foreground">({inv.invoice_date})</span></p>}
        <p className="font-bold text-destructive">BALANCE: {fmt(Math.max(balance - deposit, 0))}</p>
      </div>
    </div>
  );
}

export default function LdInvoicesPage() {
  const { data: invoices = [], isLoading } = useLdInvoices();
  const { data: cases = [] } = useLdCases();
  const { data: clients = [] } = useLdClients();
  const { data: settings } = useLdSettings();
  const createInvoice = useCreateLdInvoice();
  const updateInvoice = useUpdateLdInvoice();
  const bulkCreateItems = useBulkCreateLdInvoiceItems();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [printInvoice, setPrintInvoice] = useState<any>(null);
  const [printItems, setPrintItems] = useState<any[]>([]);
  const [detailInvoiceId, setDetailInvoiceId] = useState<string | null>(null);
  const { data: detailItems = [] } = useLdInvoiceItems(detailInvoiceId);

  // New invoice form state
  const [invClientId, setInvClientId] = useState("");
  const [invDateFrom, setInvDateFrom] = useState<Date | undefined>();
  const [invDateTo, setInvDateTo] = useState<Date | undefined>();
  const [clientSearch, setClientSearch] = useState("");

  // Auto-populate line items from cases when client + date range selected
  const matchedCases = useMemo(() => {
    if (!invClientId || !invDateFrom || !invDateTo) return [];
    return cases.filter((c: any) => {
      if (c.client_id !== invClientId) return false;
      const d = new Date(c.received_date || c.created_at);
      return d >= invDateFrom && d <= new Date(invDateTo.getTime() + 86400000);
    });
  }, [cases, invClientId, invDateFrom, invDateTo]);

  const invoiceSubtotal = matchedCases.reduce((s, c: any) => s + Number(c.net_amount || 0), 0);

  const totalRevenue = invoices.reduce((s: number, i: any) => s + Number(i.total_amount), 0);
  const totalPaid = invoices.reduce((s: number, i: any) => s + Number(i.amount_paid), 0);
  const totalOutstanding = Math.max(totalRevenue - totalPaid, 0);
  const unpaidCount = invoices.filter((i: any) => i.status !== "paid").length;

  const filtered = invoices.filter((i: any) =>
    !search || i.invoice_number?.toLowerCase().includes(search.toLowerCase()) || i.patient_name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const discount = Number(fd.get("discount") || 0);
    const deposit = Number(fd.get("deposit_amount") || 0);
    const subtotal = matchedCases.length > 0 ? invoiceSubtotal : Number(fd.get("subtotal") || 0);
    const totalAmount = Math.max(subtotal - discount, 0);
    const paid = Math.min(deposit, totalAmount);
    const status = paid >= totalAmount ? "paid" : paid > 0 ? "partial" : "unpaid";

    const selectedClient = clients.find((c: any) => c.id === invClientId);

    const values: Record<string, unknown> = {
      case_id: fd.get("case_id") || null,
      client_id: invClientId || null,
      patient_name: fd.get("patient_name") as string || selectedClient?.clinic_name || "",
      subtotal,
      discount,
      total_amount: totalAmount,
      amount_paid: paid,
      deposit_amount: deposit,
      due_date: (fd.get("due_date") as string) || null,
      date_from: invDateFrom ? format(invDateFrom, "yyyy-MM-dd") : null,
      date_to: invDateTo ? format(invDateTo, "yyyy-MM-dd") : null,
      notes: fd.get("notes") as string,
      status,
    };

    createInvoice.mutate(values, {
      onSuccess: (data: any) => {
        // Create line items from matched cases
        if (matchedCases.length > 0 && data?.id) {
          const items = matchedCases.map((c: any) => ({
            invoice_id: data.id,
            lab_case_id: c.id,
            date_in: c.received_date || c.created_at?.split("T")[0],
            code: c.case_number,
            patient_name: c.patient_name || "",
            job_description: c.work_type_name || c.job_description || "",
            units: 1,
            unit_price: Number(c.lab_fee) || 0,
            total_cost: Number(c.net_amount) || 0,
          }));
          bulkCreateItems.mutate(items);
        }
        setDialogOpen(false);
        setInvClientId("");
        setInvDateFrom(undefined);
        setInvDateTo(undefined);
        setClientSearch("");
      },
    });
  };

  const togglePaid = (inv: any) => {
    const newStatus = inv.status === "paid" ? "unpaid" : "paid";
    const newPaid = newStatus === "paid" ? Number(inv.total_amount) : 0;
    updateInvoice.mutate({ id: inv.id, status: newStatus, amount_paid: newPaid });
  };

  const handlePrint = async (inv: any) => {
    // Fetch items for this invoice
    const { data: items } = await (await import("@/integrations/supabase/client")).supabase
      .from("ld_invoice_items").select("*").eq("invoice_id", inv.id).order("created_at");
    setPrintItems(items || []);
    setPrintInvoice(inv);
    setTimeout(() => {
      const el = document.getElementById("print-invoice-content");
      if (el) {
        const printWindow = window.open("", "_blank");
        if (printWindow) {
          printWindow.document.write(`<html><head><title>Invoice ${inv.invoice_number}</title><style>body{font-family:sans-serif;font-size:12px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ddd;padding:6px}th{background:#f5f5f5}.text-right{text-align:right}.font-bold{font-weight:bold}.text-destructive{color:#dc2626}</style></head><body>${el.innerHTML}</body></html>`);
          printWindow.document.close();
          printWindow.print();
        }
      }
    }, 200);
  };

  const labName = settings?.lab_name || "Impression n Teeth";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Invoices</h1>
          <p className="text-sm text-muted-foreground">Lab billing and invoices</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) { setInvClientId(""); setInvDateFrom(undefined); setInvDateTo(undefined); setClientSearch(""); } }}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-1" /> Create Invoice</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Create Invoice</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {/* Client selection with search */}
                <div className="col-span-2">
                  <Label>Client / Clinic Name</Label>
                  <Input
                    placeholder="Type to search clients..."
                    value={clientSearch}
                    onChange={(e) => setClientSearch(e.target.value)}
                    className="mb-1"
                  />
                  <select
                    className="w-full border rounded-md p-2 text-sm bg-background"
                    value={invClientId}
                    onChange={(e) => setInvClientId(e.target.value)}
                  >
                    <option value="">None (Walk-in)</option>
                    {clients
                      .filter((c: any) => !clientSearch || c.clinic_name?.toLowerCase().includes(clientSearch.toLowerCase()) || c.doctor_name?.toLowerCase().includes(clientSearch.toLowerCase()))
                      .map((c: any) => <option key={c.id} value={c.id}>{c.clinic_code ? `[${c.clinic_code}] ` : ""}{c.clinic_name} - {c.doctor_name}</option>)}
                  </select>
                </div>

                {/* Date Range */}
                <div>
                  <Label>Date From</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !invDateFrom && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {invDateFrom ? format(invDateFrom, "MMM d, yyyy") : "Pick start date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={invDateFrom} onSelect={setInvDateFrom} /></PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label>Date To</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !invDateTo && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {invDateTo ? format(invDateTo, "MMM d, yyyy") : "Pick end date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={invDateTo} onSelect={setInvDateTo} /></PopoverContent>
                  </Popover>
                </div>

                {/* Auto-populated line items preview */}
                {matchedCases.length > 0 && (
                  <div className="col-span-2 border rounded-lg p-3 bg-muted/20 space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Auto-matched Cases ({matchedCases.length})</p>
                    <div className="overflow-x-auto max-h-40">
                      <table className="w-full text-xs">
                        <thead><tr className="border-b">
                          <th className="text-left p-1">Date In</th>
                          <th className="text-left p-1">Code</th>
                          <th className="text-left p-1">Patient</th>
                          <th className="text-left p-1">Job</th>
                          <th className="text-right p-1">Units</th>
                          <th className="text-right p-1">Price</th>
                          <th className="text-right p-1">Total</th>
                        </tr></thead>
                        <tbody>
                          {matchedCases.map((c: any) => (
                            <tr key={c.id} className="border-b border-border/20">
                              <td className="p-1">{c.received_date || c.created_at?.split("T")[0]}</td>
                              <td className="p-1 font-mono">{c.case_number}</td>
                              <td className="p-1">{c.patient_name || "—"}</td>
                              <td className="p-1">{c.work_type_name}</td>
                              <td className="p-1 text-right">{Number(c.tooth_number) || 1}</td>
                              <td className="p-1 text-right">{fmt(Number(c.lab_fee))}</td>
                              <td className="p-1 text-right font-medium">{fmt(Number(c.net_amount))}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="text-sm font-semibold text-right">Subtotal: {fmt(invoiceSubtotal)}</p>
                  </div>
                )}

                <div className="col-span-2"><Label>Patient / Label Name</Label><Input name="patient_name" placeholder="Invoice label or patient name" /></div>

                {matchedCases.length === 0 && (
                  <>
                    <div>
                      <Label>Case (optional)</Label>
                      <select name="case_id" className="w-full border rounded-md p-2 text-sm bg-background">
                        <option value="">None</option>
                        {cases.map((c: any) => <option key={c.id} value={c.id}>{c.case_number} - {c.patient_name}</option>)}
                      </select>
                    </div>
                    <div><Label>Subtotal (₦)</Label><Input name="subtotal" type="number" step="0.01" /></div>
                  </>
                )}

                <div><Label>Discount (₦)</Label><Input name="discount" type="number" step="0.01" defaultValue={0} /></div>
                <div><Label>Deposit (₦)</Label><Input name="deposit_amount" type="number" step="0.01" defaultValue={0} /></div>
                <div><Label>Due Date</Label><Input name="due_date" type="date" /></div>
                <div className="col-span-2"><Label>Notes</Label><Input name="notes" /></div>
              </div>
              <Button type="submit" className="w-full" disabled={createInvoice.isPending}>Create Invoice</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        {[
          { label: "Total Revenue", value: totalRevenue, icon: DollarSign, color: "text-primary", bg: "bg-primary/10" },
          { label: "Paid", value: totalPaid, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-500/10" },
          { label: "Outstanding", value: totalOutstanding, icon: AlertCircle, color: "text-destructive", bg: "bg-destructive/10" },
          { label: "Unpaid Invoices", value: unpaidCount, icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-500/10", noFmt: true },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-3 p-4">
              <div className={`h-10 w-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-xl font-bold">
                  {s.noFmt ? <AnimatedCounter value={s.value} /> : fmt(s.value)}
                </p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search invoices..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <Card className="border-border/50">
        <CardHeader className="border-b border-border/30">
          <CardTitle className="text-base">Lab Invoices</CardTitle>
          <CardDescription>All lab invoices with payment tracking</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/30">
                  <th className="text-left p-3 font-medium text-muted-foreground">Invoice #</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Patient</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Client</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Period</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Total</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Deposit</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Paid</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Balance</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={11} className="p-8 text-center text-muted-foreground">Loading...</td></tr>
                ) : !filtered.length ? (
                  <tr><td colSpan={11} className="p-8 text-center text-muted-foreground">No invoices found</td></tr>
                ) : filtered.map((i: any) => {
                  const balance = Number(i.total_amount) - Number(i.amount_paid);
                  const isOverdue = i.due_date && new Date(i.due_date) < new Date() && i.status !== "paid";
                  return (
                    <tr key={i.id} className={`border-b border-border/30 hover:bg-muted/20 ${isOverdue ? "bg-destructive/5" : ""}`}>
                      <td className="p-3 font-mono text-xs text-secondary">{i.invoice_number}</td>
                      <td className="p-3">{i.patient_name || "—"}</td>
                      <td className="p-3 text-xs">{i.client?.clinic_name || "—"}</td>
                      <td className="p-3 text-xs">
                        {i.date_from && i.date_to
                          ? `${format(new Date(i.date_from), "MMM d")} – ${format(new Date(i.date_to), "MMM d")}`
                          : "—"}
                      </td>
                      <td className="p-3 text-xs">{format(new Date(i.invoice_date), "MMM d, yyyy")}</td>
                      <td className="p-3 text-right font-medium">{fmt(Number(i.total_amount))}</td>
                      <td className="p-3 text-right text-xs">{fmt(Number(i.deposit_amount || 0))}</td>
                      <td className="p-3 text-right">{fmt(Number(i.amount_paid))}</td>
                      <td className="p-3 text-right font-semibold">
                        <span className={balance > 0 ? "text-destructive" : "text-emerald-600"}>{fmt(balance)}</span>
                      </td>
                      <td className="p-3">
                        <Badge className={`text-[10px] ${statusColor[i.status] || "bg-muted text-muted-foreground"}`}>{i.status}</Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant={i.status === "paid" ? "outline" : "default"}
                            className="text-xs h-7"
                            onClick={() => togglePaid(i)}
                            disabled={updateInvoice.isPending}
                          >
                            {i.status === "paid" ? "Unpaid" : "Paid"}
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7" title="Print Invoice" onClick={() => handlePrint(i)}>
                            <Printer className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7" title="Send via WhatsApp" asChild>
                            <a href={buildWhatsAppMessage(i, settings?.phone, labName)} target="_blank" rel="noopener noreferrer">
                              <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
                            </a>
                          </Button>
                          {isOverdue && (
                            <Button size="icon" variant="ghost" className="h-7 w-7" title="Send Payment Reminder via WhatsApp" asChild>
                              <a href={buildWhatsAppMessage(i, settings?.phone, labName, true)} target="_blank" rel="noopener noreferrer">
                                <AlertCircle className="h-3.5 w-3.5 text-destructive" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Hidden printable invoice */}
      <div className="hidden">
        <div id="print-invoice-content">
          {printInvoice && <PrintableInvoice inv={printInvoice} labName={labName} items={printItems} />}
        </div>
      </div>
    </div>
  );
}
