import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { Printer, CreditCard, Loader2, Mail, MessageCircle, Building2, Phone, MapPin, Globe, Pencil, X, Save, Plus, Trash2 } from "lucide-react";
import { useInvoiceItems, useUpdateInvoice, useDeleteInvoice } from "@/hooks/useInvoices";
import { usePayments, useRecordPayment } from "@/hooks/usePayments";
import { useClinicSettings } from "@/hooks/useClinicSettings";
import { useAuth } from "@/hooks/useAuth";
import type { InvoiceWithPatient } from "@/hooks/useInvoices";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import logo from "@/assets/logo.jpg";

interface InvoiceDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: InvoiceWithPatient | null;
}

function formatCurrency(amount: number) {
  return `₦${amount.toLocaleString()}`;
}

function getInvoiceHTML(invoice: InvoiceWithPatient, lineItems: any[], payments: any[], clinic: any, balance: number) {
  const clinicName = clinic?.clinic_name || "Vista Dental Care";
  const clinicPhone = clinic?.phone || "";
  const clinicAddress = clinic?.address || "";
  const clinicEmail = clinic?.email || "";

  const rows = lineItems.map(item =>
    `<tr>
      <td style="padding:10px 14px;border-bottom:1px solid #e5e7eb">${item.description}</td>
      <td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;text-align:center">${item.quantity}</td>
      <td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;text-align:right">₦${item.unit_price.toLocaleString()}</td>
      <td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:600">₦${item.line_total.toLocaleString()}</td>
    </tr>`
  ).join("");

  const payRows = payments.map(p =>
    `<tr>
      <td style="padding:8px 14px;border-bottom:1px solid #e5e7eb">${p.payment_date}</td>
      <td style="padding:8px 14px;border-bottom:1px solid #e5e7eb;text-transform:capitalize">${p.payment_method}</td>
      <td style="padding:8px 14px;border-bottom:1px solid #e5e7eb;text-align:right;color:#16a34a;font-weight:600">₦${p.amount.toLocaleString()}</td>
    </tr>`
  ).join("");

  const subtotal = lineItems.reduce((s: number, i: any) => s + i.line_total, 0);

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Invoice ${invoice.invoice_number}</title>
    <style>
      *{margin:0;padding:0;box-sizing:border-box}
      body{font-family:'Segoe UI',system-ui,-apple-system,sans-serif;color:#1f2937;background:#fff;padding:0;margin:0}
      .invoice-container{max-width:800px;margin:0 auto;padding:40px}
      .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px;padding-bottom:24px;border-bottom:3px solid #0891b2}
      .clinic-info h1{font-size:24px;color:#0891b2;margin-bottom:4px;font-weight:700}
      .clinic-info p{font-size:12px;color:#6b7280;line-height:1.6}
      .invoice-meta{text-align:right}
      .invoice-meta h2{font-size:28px;color:#1f2937;font-weight:800;letter-spacing:-0.5px}
      .invoice-meta .inv-number{font-family:'Courier New',monospace;font-size:14px;color:#0891b2;font-weight:600;margin-top:4px}
      .invoice-meta .inv-date{font-size:12px;color:#6b7280;margin-top:2px}
      .patient-section{background:#f9fafb;border-radius:8px;padding:16px 20px;margin-bottom:24px}
      .patient-section h3{font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#6b7280;margin-bottom:6px;font-weight:600}
      .patient-section p{font-size:14px;font-weight:600;color:#1f2937}
      table{width:100%;border-collapse:collapse;margin:16px 0}
      thead th{text-align:left;padding:10px 14px;border-bottom:2px solid #1f2937;font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#6b7280;font-weight:600}
      .totals{margin-top:16px;margin-left:auto;width:280px}
      .totals .row{display:flex;justify-content:space-between;padding:6px 0;font-size:13px;color:#4b5563}
      .totals .row.total{border-top:2px solid #1f2937;padding-top:10px;margin-top:6px;font-size:18px;font-weight:700;color:#1f2937}
      .totals .row.balance{font-size:16px;font-weight:700}
      .status-badge{display:inline-block;padding:4px 12px;border-radius:20px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em}
      .status-paid{background:#dcfce7;color:#16a34a}
      .status-pending{background:#fee2e2;color:#dc2626}
      .status-partial{background:#fef3c7;color:#d97706}
      .payment-section{margin-top:24px;padding-top:20px;border-top:1px solid #e5e7eb}
      .payment-section h3{font-size:14px;font-weight:600;margin-bottom:12px}
      .footer{margin-top:40px;padding-top:20px;border-top:1px solid #e5e7eb;text-align:center;font-size:11px;color:#9ca3af}
      .footer p{margin-bottom:2px}
      @media print{body{padding:0}.invoice-container{padding:20px}button,.no-print{display:none!important}}
    </style></head><body>
    <div class="invoice-container">
      <div class="header">
        <div class="clinic-info">
          <h1>${clinicName}</h1>
          ${clinicAddress ? `<p>📍 ${clinicAddress}</p>` : ""}
          ${clinicPhone ? `<p>📞 ${clinicPhone}</p>` : ""}
          ${clinicEmail ? `<p>✉️ ${clinicEmail}</p>` : ""}
        </div>
        <div class="invoice-meta">
          <h2>INVOICE</h2>
          <div class="inv-number">${invoice.invoice_number}</div>
          <div class="inv-date">${invoice.invoice_date}</div>
          <div style="margin-top:8px">
            <span class="status-badge status-${invoice.status}">${invoice.status}</span>
          </div>
        </div>
      </div>
      <div class="patient-section">
        <h3>Bill To</h3>
        <p>${invoice.patient_name}</p>
      </div>
      <table>
        <thead><tr>
          <th>Description</th>
          <th style="text-align:center">Qty</th>
          <th style="text-align:right">Unit Price</th>
          <th style="text-align:right">Amount</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="totals">
        <div class="row"><span>Subtotal</span><span>₦${subtotal.toLocaleString()}</span></div>
        ${invoice.discount_percent > 0 ? `<div class="row" style="color:#dc2626"><span>Discount (${invoice.discount_percent}%)</span><span>-₦${Math.round(subtotal * invoice.discount_percent / 100).toLocaleString()}</span></div>` : ""}
        <div class="row total"><span>Total</span><span>₦${invoice.total_amount.toLocaleString()}</span></div>
        <div class="row"><span>Amount Paid</span><span style="color:#16a34a">₦${invoice.amount_paid.toLocaleString()}</span></div>
        <div class="row balance"><span>Balance Due</span><span style="color:${balance > 0 ? '#dc2626' : '#16a34a'}">₦${balance.toLocaleString()}</span></div>
      </div>
      ${payments.length > 0 ? `
        <div class="payment-section">
          <h3>Payment History</h3>
          <table>
            <thead><tr><th>Date</th><th>Method</th><th style="text-align:right">Amount</th></tr></thead>
            <tbody>${payRows}</tbody>
          </table>
        </div>` : ""}
      <div class="footer">
        <p><strong>${clinicName}</strong></p>
        <p>Thank you for choosing us for your dental care.</p>
        ${clinicPhone ? `<p>${clinicPhone}</p>` : ""}
      </div>
    </div>
    <script>window.onload=()=>window.print()</script>
    </body></html>`;
}

export function InvoiceDetailDialog({ open, onOpenChange, invoice }: InvoiceDetailDialogProps) {
  const [showPayment, setShowPayment] = useState(false);
  const [payAmount, setPayAmount] = useState("");
  const [payMethod, setPayMethod] = useState("cash");
  const [isEditing, setIsEditing] = useState(false);
  const [editDiscount, setEditDiscount] = useState(0);
  const [editNotes, setEditNotes] = useState("");
  const [editItems, setEditItems] = useState<{ id?: string; treatment_id: string | null; description: string; quantity: number; unit_price: number; line_total: number }[]>([]);

  const { data: lineItems = [], isLoading: itemsLoading } = useInvoiceItems(invoice?.id ?? null);
  const { data: payments = [], isLoading: paymentsLoading } = usePayments(invoice?.id ?? null);
  const recordPayment = useRecordPayment();
  const updateInvoice = useUpdateInvoice();
  const deleteInvoice = useDeleteInvoice();
  const { data: clinic } = useClinicSettings();
  const { roles } = useAuth();
  const isAdmin = roles.includes("admin");

  if (!invoice) return null;

  const balance = invoice.total_amount - invoice.amount_paid;

  const startEditing = () => {
    setEditDiscount(invoice.discount_percent);
    setEditNotes(invoice.notes || "");
    setEditItems(lineItems.map(li => ({ id: li.id, treatment_id: li.treatment_id, description: li.description, quantity: li.quantity, unit_price: li.unit_price, line_total: li.line_total })));
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    try {
      await updateInvoice.mutateAsync({
        id: invoice.id,
        discount_percent: editDiscount,
        notes: editNotes,
        line_items: editItems,
      });
      toast({ title: "Invoice updated" });
      setIsEditing(false);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const updateEditItem = (index: number, field: string, value: any) => {
    setEditItems(prev => {
      const updated = [...prev];
      (updated[index] as any)[field] = value;
      if (field === "quantity" || field === "unit_price") {
        updated[index].line_total = updated[index].quantity * updated[index].unit_price;
      }
      return updated;
    });
  };

  const addEditItem = () => {
    setEditItems(prev => [...prev, { treatment_id: null, description: "", quantity: 1, unit_price: 0, line_total: 0 }]);
  };

  const removeEditItem = (index: number) => {
    setEditItems(prev => prev.filter((_, i) => i !== index));
  };

  const statusStyles: Record<string, string> = {
    paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
    pending: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400",
    partial: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
  };

  const handleRecordPayment = async () => {
    const amount = parseFloat(payAmount);
    if (!amount || amount <= 0 || amount > balance) {
      toast({ title: "Invalid amount", variant: "destructive" });
      return;
    }
    try {
      await recordPayment.mutateAsync({
        invoice_id: invoice.id,
        amount,
        payment_method: payMethod,
      });
      toast({ title: "Payment recorded", description: `${formatCurrency(amount)} via ${payMethod}` });
      setShowPayment(false);
      setPayAmount("");
    } catch (err: any) {
      toast({ title: "Error recording payment", description: err.message, variant: "destructive" });
    }
  };

  const handlePrint = () => {
    const html = getInvoiceHTML(invoice, lineItems, payments, clinic, balance);
    const w = window.open("", "_blank");
    w?.document.write(html);
    w?.document.close();
  };

  const handleDeleteInvoice = async () => {
    try {
      await deleteInvoice.mutateAsync(invoice.id);
      toast({ title: "Invoice deleted", description: `${invoice.invoice_number} has been permanently deleted.` });
      onOpenChange(false);
    } catch (err: any) {
      toast({ title: "Error deleting invoice", description: err.message, variant: "destructive" });
    }
  };

  const handleEmail = () => {
    const clinicName = clinic?.clinic_name || "Vista Dental Care";
    const clinicPhone = clinic?.phone || "";
    const clinicAddress = clinic?.address || "";
    const subject = `Invoice ${invoice.invoice_number} from ${clinicName}`;
    let body = `${clinicName}\n`;
    if (clinicAddress) body += `${clinicAddress}\n`;
    if (clinicPhone) body += `${clinicPhone}\n`;
    body += `\n──────────────────────────\n`;
    body += `INVOICE: ${invoice.invoice_number}\n`;
    body += `Date: ${invoice.invoice_date}\n`;
    body += `Patient: ${invoice.patient_name}\n`;
    body += `Status: ${invoice.status.toUpperCase()}\n`;
    body += `──────────────────────────\n\n`;
    body += `Items:\n`;
    lineItems.forEach(item => {
      body += `  • ${item.description} (x${item.quantity}) — ₦${item.line_total.toLocaleString()}\n`;
    });
    body += `\n──────────────────────────\n`;
    if (invoice.discount_percent > 0) {
      body += `Discount: ${invoice.discount_percent}%\n`;
    }
    body += `Total: ₦${invoice.total_amount.toLocaleString()}\n`;
    body += `Paid: ₦${invoice.amount_paid.toLocaleString()}\n`;
    body += `Balance Due: ₦${balance.toLocaleString()}\n`;
    body += `──────────────────────────\n\n`;
    body += `Thank you for choosing ${clinicName} for your dental care.`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, "_blank");
  };

  const handleWhatsApp = () => {
    const clinicName = clinic?.clinic_name || "Vista Dental Care";
    let text = `🏥 *${clinicName}*\n\n`;
    text += `📋 *Invoice ${invoice.invoice_number}*\n`;
    text += `📅 Date: ${invoice.invoice_date}\n`;
    text += `👤 Patient: ${invoice.patient_name}\n\n`;
    text += `*Items:*\n`;
    lineItems.forEach(item => {
      text += `• ${item.description} x${item.quantity}: ₦${item.line_total.toLocaleString()}\n`;
    });
    text += `\n💰 *Total:* ₦${invoice.total_amount.toLocaleString()}\n`;
    text += `✅ *Paid:* ₦${invoice.amount_paid.toLocaleString()}\n`;
    text += `📊 *Balance:* ₦${balance.toLocaleString()}\n\n`;
    text += `Thank you for choosing ${clinicName}! 😊`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Professional Invoice Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b-2 border-secondary">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Clinic Logo" className="h-14 w-14 rounded-xl object-cover border border-border shadow-sm" />
            <div>
              <h2 className="text-lg font-bold text-foreground">{clinic?.clinic_name || "Vista Dental Care"}</h2>
              {clinic?.address && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" />{clinic.address}
                </p>
              )}
              <div className="flex gap-3 mt-0.5">
                {clinic?.phone && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Phone className="h-3 w-3" />{clinic.phone}
                  </p>
                )}
                {clinic?.email && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Globe className="h-3 w-3" />{clinic.email}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="text-right shrink-0">
            <h3 className="text-2xl font-extrabold tracking-tight text-foreground">INVOICE</h3>
            <p className="font-mono text-sm text-secondary font-semibold mt-0.5">{invoice.invoice_number}</p>
            <p className="text-xs text-muted-foreground">{invoice.invoice_date}</p>
            <Badge className={`mt-1.5 ${statusStyles[invoice.status]}`}>{invoice.status}</Badge>
          </div>
        </div>

        <div className="space-y-5 text-sm mt-2">
          {/* Bill To */}
          <div className="bg-muted/30 rounded-lg p-3">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-1">Bill To</p>
            <p className="font-semibold text-foreground">{invoice.patient_name}</p>
          </div>

          {/* Line items */}
          <div>
            <h4 className="font-semibold mb-2 text-foreground">Items</h4>
            {itemsLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isEditing ? (
              <div className="space-y-2">
                {editItems.map((item, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <Input className="flex-1 text-xs" placeholder="Description" value={item.description} onChange={(e) => updateEditItem(idx, "description", e.target.value)} />
                    <Input className="w-16 text-xs" type="number" placeholder="Qty" value={item.quantity} onChange={(e) => updateEditItem(idx, "quantity", parseInt(e.target.value) || 0)} />
                    <Input className="w-24 text-xs" type="number" placeholder="Price" value={item.unit_price} onChange={(e) => updateEditItem(idx, "unit_price", parseFloat(e.target.value) || 0)} />
                    <span className="text-xs font-semibold w-20 text-right">{formatCurrency(item.line_total)}</span>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeEditItem(idx)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addEditItem} className="text-xs"><Plus className="mr-1 h-3 w-3" />Add Item</Button>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-xs w-24">Discount %</Label>
                    <Input className="w-20 text-xs" type="number" value={editDiscount} onChange={(e) => setEditDiscount(parseFloat(e.target.value) || 0)} />
                  </div>
                  <div className="flex items-start gap-2">
                    <Label className="text-xs w-24 pt-2">Notes</Label>
                    <Textarea className="text-xs flex-1" rows={2} value={editNotes} onChange={(e) => setEditNotes(e.target.value)} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-muted/40">
                      <th className="text-left py-2.5 px-3 text-muted-foreground font-semibold text-[10px] uppercase tracking-wider">Description</th>
                      <th className="text-center py-2.5 px-3 text-muted-foreground font-semibold text-[10px] uppercase tracking-wider w-14">Qty</th>
                      <th className="text-right py-2.5 px-3 text-muted-foreground font-semibold text-[10px] uppercase tracking-wider">Price</th>
                      <th className="text-right py-2.5 px-3 text-muted-foreground font-semibold text-[10px] uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lineItems.map((item) => (
                      <tr key={item.id} className="border-t border-border/50">
                        <td className="py-2.5 px-3 font-medium">{item.description}</td>
                        <td className="text-center py-2.5 px-3">{item.quantity}</td>
                        <td className="text-right py-2.5 px-3 text-muted-foreground">{formatCurrency(item.unit_price)}</td>
                        <td className="text-right py-2.5 px-3 font-semibold">{formatCurrency(item.line_total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Totals */}
            <div className="ml-auto w-64 mt-3 space-y-1.5">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatCurrency(lineItems.reduce((s, i) => s + i.line_total, 0))}</span>
              </div>
              {invoice.discount_percent > 0 && (
                <div className="flex justify-between text-xs text-red-600">
                  <span>Discount ({invoice.discount_percent}%)</span>
                  <span>-{formatCurrency(Math.round(lineItems.reduce((s, i) => s + i.line_total, 0) * invoice.discount_percent / 100))}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span>{formatCurrency(invoice.total_amount)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Paid</span>
                <span className="text-emerald-600 font-medium">{formatCurrency(invoice.amount_paid)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm pt-1 border-t">
                <span>Balance Due</span>
                <span className={balance > 0 ? "text-red-600" : "text-emerald-600"}>{formatCurrency(balance)}</span>
              </div>
            </div>
          </div>

          {/* Payment history */}
          <div>
            <h4 className="font-semibold mb-2 text-foreground">Payment History</h4>
            {paymentsLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : payments.length > 0 ? (
              <div className="space-y-1.5">
                {payments.map((p) => (
                  <div key={p.id} className="flex justify-between text-xs bg-muted/30 rounded-lg p-2.5">
                    <span className="text-muted-foreground">
                      {p.payment_date} · <span className="capitalize">{p.payment_method}</span>
                      {p.reference ? ` · ${p.reference}` : ""}
                    </span>
                    <span className="font-semibold text-emerald-700">{formatCurrency(p.amount)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground bg-muted/20 rounded-lg p-3 text-center">No payments recorded yet.</p>
            )}
          </div>

          {/* Record payment form */}
          {showPayment && balance > 0 && (
            <>
              <Separator />
              <div className="space-y-3 bg-muted/20 rounded-lg p-4">
                <h4 className="font-semibold">Record Payment</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Amount</Label>
                    <Input type="number" placeholder={`Max ${formatCurrency(balance)}`} value={payAmount} onChange={(e) => setPayAmount(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Method</Label>
                    <Select value={payMethod} onValueChange={setPayMethod}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="transfer">Bank Transfer</SelectItem>
                        <SelectItem value="pos">POS</SelectItem>
                        <SelectItem value="card">Card</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button size="sm" onClick={handleRecordPayment} className="bg-secondary hover:bg-secondary/90" disabled={recordPayment.isPending}>
                  {recordPayment.isPending ? "Recording..." : "Confirm Payment"}
                </Button>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="flex-row gap-2 flex-wrap pt-4 border-t">
          {isEditing ? (
            <>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                <X className="mr-1.5 h-3.5 w-3.5" />Cancel
              </Button>
              <Button size="sm" onClick={handleSaveEdit} className="bg-secondary hover:bg-secondary/90" disabled={updateInvoice.isPending}>
                <Save className="mr-1.5 h-3.5 w-3.5" />{updateInvoice.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={startEditing}>
                <Pencil className="mr-1.5 h-3.5 w-3.5" />Edit
              </Button>
              {isAdmin && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="mr-1.5 h-3.5 w-3.5" />Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Invoice {invoice.invoice_number}?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete this invoice, all its line items, and all associated payment records. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteInvoice} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        {deleteInvoice.isPending ? "Deleting..." : "Delete Invoice"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="mr-1.5 h-3.5 w-3.5" />Print
              </Button>
              <Button variant="outline" size="sm" onClick={handleEmail}>
                <Mail className="mr-1.5 h-3.5 w-3.5" />Email
              </Button>
              <Button variant="outline" size="sm" onClick={handleWhatsApp}>
                <MessageCircle className="mr-1.5 h-3.5 w-3.5" />WhatsApp
              </Button>
              {balance > 0 && (
                <Button size="sm" onClick={() => setShowPayment(!showPayment)} className="bg-secondary hover:bg-secondary/90">
                  <CreditCard className="mr-1.5 h-3.5 w-3.5" />Record Payment
                </Button>
              )}
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
