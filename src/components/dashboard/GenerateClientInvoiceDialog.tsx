import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, FileText, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { usePatients } from "@/hooks/usePatients";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface GenerateClientInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatCurrency(amount: number) {
  return `₦${amount.toLocaleString()}`;
}

interface FetchedInvoice {
  id: string;
  invoice_number: string;
  invoice_date: string;
  total_amount: number;
  amount_paid: number;
  status: string;
}

export function GenerateClientInvoiceDialog({ open, onOpenChange }: GenerateClientInvoiceDialogProps) {
  const { data: patients = [] } = usePatients();
  const [patientId, setPatientId] = useState("");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<FetchedInvoice[] | null>(null);

  const selectedPatient = patients.find((p) => p.id === patientId);

  const handleGenerate = async () => {
    if (!patientId || !dateFrom || !dateTo) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const fromStr = format(dateFrom, "yyyy-MM-dd");
      const toStr = format(dateTo, "yyyy-MM-dd");

      const { data, error } = await supabase
        .from("invoices")
        .select("id, invoice_number, invoice_date, total_amount, amount_paid, status")
        .eq("patient_id", patientId)
        .gte("invoice_date", fromStr)
        .lte("invoice_date", toStr)
        .order("invoice_date", { ascending: true });

      if (error) throw error;
      setResults(data as FetchedInvoice[]);
    } catch (err: any) {
      toast({ title: "Error fetching invoices", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = results?.reduce((s, i) => s + Number(i.total_amount), 0) ?? 0;
  const totalPaid = results?.reduce((s, i) => s + Number(i.amount_paid), 0) ?? 0;
  const totalBalance = totalAmount - totalPaid;

  const handlePrint = () => {
    const patientName = selectedPatient ? `${selectedPatient.first_name} ${selectedPatient.last_name}` : "Client";
    const fromStr = dateFrom ? format(dateFrom, "dd MMM yyyy") : "";
    const toStr = dateTo ? format(dateTo, "dd MMM yyyy") : "";

    const rows = (results || [])
      .map(
        (inv) =>
          `<tr>
            <td style="padding:6px 10px;border-bottom:1px solid #eee;font-family:monospace;font-size:12px">${inv.invoice_number}</td>
            <td style="padding:6px 10px;border-bottom:1px solid #eee">${inv.invoice_date}</td>
            <td style="padding:6px 10px;border-bottom:1px solid #eee;text-align:right">${formatCurrency(inv.total_amount)}</td>
            <td style="padding:6px 10px;border-bottom:1px solid #eee;text-align:right">${formatCurrency(inv.amount_paid)}</td>
            <td style="padding:6px 10px;border-bottom:1px solid #eee;text-align:right;font-weight:600">${formatCurrency(inv.total_amount - inv.amount_paid)}</td>
            <td style="padding:6px 10px;border-bottom:1px solid #eee;text-transform:capitalize">${inv.status}</td>
          </tr>`
      )
      .join("");

    const html = `
      <html><head><title>Statement - ${patientName}</title>
      <style>body{font-family:system-ui,sans-serif;padding:40px;color:#1a1a1a}
      h1{font-size:20px;margin-bottom:4px}table{width:100%;border-collapse:collapse;margin:16px 0}
      th{text-align:left;padding:8px 10px;border-bottom:2px solid #333;font-size:12px;text-transform:uppercase;letter-spacing:.05em}
      .summary{margin-top:16px;padding:16px;background:#f5f5f5;border-radius:8px}
      @media print{body{padding:20px}.no-print{display:none}}</style></head>
      <body>
        <h1>Account Statement</h1>
        <p style="color:#666;margin:0 0 16px">${patientName} &bull; ${fromStr} – ${toStr}</p>
        <table>
          <thead><tr>
            <th>Invoice #</th><th>Date</th><th style="text-align:right">Amount</th>
            <th style="text-align:right">Paid</th><th style="text-align:right">Balance</th><th>Status</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <div class="summary">
          <div style="display:flex;justify-content:space-between;margin-bottom:4px"><span>Total Amount:</span><strong>${formatCurrency(totalAmount)}</strong></div>
          <div style="display:flex;justify-content:space-between;margin-bottom:4px"><span>Total Paid:</span><strong>${formatCurrency(totalPaid)}</strong></div>
          <div style="display:flex;justify-content:space-between;font-size:18px"><span>Balance Due:</span><strong style="color:${totalBalance > 0 ? '#dc2626' : '#16a34a'}">${formatCurrency(totalBalance)}</strong></div>
        </div>
        <script>window.onload=()=>window.print()</script>
      </body></html>
    `;
    const w = window.open("", "_blank");
    w?.document.write(html);
    w?.document.close();
  };

  const handleShareWhatsApp = () => {
    const patientName = selectedPatient ? `${selectedPatient.first_name} ${selectedPatient.last_name}` : "Client";
    const fromStr = dateFrom ? format(dateFrom, "dd MMM yyyy") : "";
    const toStr = dateTo ? format(dateTo, "dd MMM yyyy") : "";

    let text = `📋 *Account Statement*\n*Patient:* ${patientName}\n*Period:* ${fromStr} – ${toStr}\n\n`;
    (results || []).forEach((inv) => {
      text += `• ${inv.invoice_number} | ${inv.invoice_date} | ${formatCurrency(inv.total_amount)} | Paid: ${formatCurrency(inv.amount_paid)} | *${inv.status}*\n`;
    });
    text += `\n*Total:* ${formatCurrency(totalAmount)}\n*Paid:* ${formatCurrency(totalPaid)}\n*Balance Due:* ${formatCurrency(totalBalance)}`;

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleShareEmail = () => {
    const patientName = selectedPatient ? `${selectedPatient.first_name} ${selectedPatient.last_name}` : "Client";
    const fromStr = dateFrom ? format(dateFrom, "dd MMM yyyy") : "";
    const toStr = dateTo ? format(dateTo, "dd MMM yyyy") : "";

    const subject = `Account Statement - ${patientName} (${fromStr} - ${toStr})`;
    let body = `Account Statement\nPatient: ${patientName}\nPeriod: ${fromStr} – ${toStr}\n\n`;
    (results || []).forEach((inv) => {
      body += `${inv.invoice_number} | ${inv.invoice_date} | ${formatCurrency(inv.total_amount)} | Paid: ${formatCurrency(inv.amount_paid)} | ${inv.status}\n`;
    });
    body += `\nTotal: ${formatCurrency(totalAmount)}\nPaid: ${formatCurrency(totalPaid)}\nBalance Due: ${formatCurrency(totalBalance)}`;

    window.open(`mailto:${selectedPatient?.email || ""}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, "_blank");
  };

  const handleReset = () => {
    setPatientId("");
    setDateFrom(undefined);
    setDateTo(undefined);
    setResults(null);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleReset(); onOpenChange(o); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Generate Client Statement</DialogTitle>
          <DialogDescription>Select a patient and date range to generate an account statement.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Patient selector */}
          <div className="space-y-1.5">
            <Label>Patient *</Label>
            <Select value={patientId} onValueChange={(v) => { setPatientId(v); setResults(null); }}>
              <SelectTrigger><SelectValue placeholder="Select patient" /></SelectTrigger>
              <SelectContent>
                {patients.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.first_name} {p.last_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date range */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>From Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !dateFrom && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "dd MMM yyyy") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dateFrom} onSelect={(d) => { setDateFrom(d); setResults(null); }} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-1.5">
              <Label>To Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !dateTo && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "dd MMM yyyy") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dateTo} onSelect={(d) => { setDateTo(d); setResults(null); }} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Button onClick={handleGenerate} disabled={loading || !patientId || !dateFrom || !dateTo} className="bg-secondary hover:bg-secondary/90">
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating...</> : <><FileText className="mr-2 h-4 w-4" />Generate Statement</>}
          </Button>

          {/* Results */}
          {results !== null && (
            <>
              <Separator />
              {results.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No invoices found for this period.</p>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/20">
                          <th className="py-2 px-3 text-left text-xs font-medium text-muted-foreground">Invoice</th>
                          <th className="py-2 px-3 text-left text-xs font-medium text-muted-foreground">Date</th>
                          <th className="py-2 px-3 text-right text-xs font-medium text-muted-foreground">Amount</th>
                          <th className="py-2 px-3 text-right text-xs font-medium text-muted-foreground">Paid</th>
                          <th className="py-2 px-3 text-right text-xs font-medium text-muted-foreground">Balance</th>
                          <th className="py-2 px-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.map((inv) => (
                          <tr key={inv.id} className="border-b border-border/30">
                            <td className="py-2 px-3 font-mono text-xs">{inv.invoice_number}</td>
                            <td className="py-2 px-3 text-xs">{inv.invoice_date}</td>
                            <td className="py-2 px-3 text-right text-xs font-semibold">{formatCurrency(inv.total_amount)}</td>
                            <td className="py-2 px-3 text-right text-xs">{formatCurrency(inv.amount_paid)}</td>
                            <td className="py-2 px-3 text-right text-xs font-semibold">{formatCurrency(inv.total_amount - inv.amount_paid)}</td>
                            <td className="py-2 px-3 text-xs capitalize">{inv.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="rounded-lg border p-4 bg-muted/30 space-y-1 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Total Amount</span><span className="font-semibold">{formatCurrency(totalAmount)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Total Paid</span><span className="font-semibold">{formatCurrency(totalPaid)}</span></div>
                    <Separator className="my-1" />
                    <div className="flex justify-between text-base font-bold">
                      <span>Balance Due</span>
                      <span className={totalBalance > 0 ? "text-red-600" : "text-emerald-600"}>{formatCurrency(totalBalance)}</span>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {results && results.length > 0 && (
          <DialogFooter className="flex-row gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              🖨️ Print
            </Button>
            <Button variant="outline" size="sm" onClick={handleShareEmail}>
              ✉️ Email
            </Button>
            <Button variant="outline" size="sm" onClick={handleShareWhatsApp}>
              💬 WhatsApp
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
