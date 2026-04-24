import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, DollarSign, TrendingUp, AlertCircle, MessageCircle } from "lucide-react";
import { useClinicSettings } from "@/hooks/useClinicSettings";
import { useLabSettings } from "@/hooks/useLabClients";
import { useLabInvoices, useLabInvoiceStats, useCreateLabInvoice, useUpdateLabInvoice } from "@/hooks/useLabInvoices";
import { useLabCases } from "@/hooks/useLabCases";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { AnimatedCounter } from "@/components/dashboard/AnimatedCounter";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";

const statusStyles: Record<string, string> = {
  paid: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  unpaid: "bg-red-500/10 text-red-700 dark:text-red-400",
  partial: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
};

function fmt(v: number) {
  return `₦${v.toLocaleString()}`;
}

function buildWhatsAppMessage(inv: any, ownerPhone?: string | null, labName?: string) {
  const lines = [
    `🏥 *${labName || "Impressions 'n' Teeth Ltd"}*`,
    `📄 *Lab Invoice: ${inv.invoice_number}*`,
    ``,
    `👨‍⚕️ Doctor: ${inv.clinic_doctor_name || inv.clinic_code || "—"}`,
    `🦷 Patient: ${inv.patient_name || "—"}`,
    `📅 Date: ${inv.invoice_date}`,
    ``,
    `💰 Subtotal: ${fmt(Number(inv.subtotal))}`,
    inv.discount > 0 ? `🏷️ Discount: ${fmt(Number(inv.discount))}` : null,
    `✅ Total: ${fmt(Number(inv.total_amount))}`,
    Number(inv.deposit_amount) > 0 ? `💳 Deposit: ${fmt(Number(inv.deposit_amount))}` : null,
    `💵 Paid: ${fmt(Number(inv.amount_paid))}`,
    `⚠️ Outstanding: ${fmt(Number(inv.total_amount) - Number(inv.amount_paid))}`,
    ``,
    `Status: ${inv.status.toUpperCase()}`,
    inv.notes ? `📝 Notes: ${inv.notes}` : null,
  ].filter(Boolean).join("\n");

  const encoded = encodeURIComponent(lines);
  const phone = ownerPhone ? ownerPhone.replace(/\D/g, "") : "";
  return phone ? `https://wa.me/${phone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
}

export default function LabBillingPage() {
  const { invoices, totalRevenue, totalPaid, totalOutstanding, unpaidCount, isLoading } = useLabInvoiceStats();
  const { data: labCases = [] } = useLabCases();
  const { data: clinicSettings } = useClinicSettings();
  const { data: labSettings } = useLabSettings();
  const labName = labSettings?.lab_name || "Impression n Teeth";
  const createInvoice = useCreateLabInvoice();
  const updateInvoice = useUpdateLabInvoice();
  const [createOpen, setCreateOpen] = useState(false);

  // Create invoice form state
  const [selectedCaseId, setSelectedCaseId] = useState("");
  const [manualSubtotal, setManualSubtotal] = useState(0);
  const [manualDiscount, setManualDiscount] = useState(0);
  const [manualPaid, setManualPaid] = useState(0);
  const [notes, setNotes] = useState("");

  const selectedCase = labCases.find((c) => c.id === selectedCaseId);

  const handleCreate = () => {
    const sub = selectedCase ? Number(selectedCase.lab_fee) : manualSubtotal;
    const disc = selectedCase ? Number(selectedCase.discount || 0) : manualDiscount;
    createInvoice.mutate({
      clinic_code: selectedCase?.clinic_code || "",
      clinic_doctor_name: selectedCase?.clinic_doctor_name || "",
      patient_name: selectedCase?.patients ? `${selectedCase.patients.first_name} ${selectedCase.patients.last_name}` : "",
      lab_case_id: selectedCaseId || undefined,
      subtotal: sub,
      discount: disc,
      amount_paid: manualPaid,
      notes,
    }, {
      onSuccess: () => {
        setCreateOpen(false);
        setSelectedCaseId("");
        setManualSubtotal(0);
        setManualDiscount(0);
        setManualPaid(0);
        setNotes("");
      },
    });
  };

  const togglePaid = (inv: any) => {
    const newStatus = inv.status === "paid" ? "unpaid" : "paid";
    const newPaid = newStatus === "paid" ? Number(inv.total_amount) : 0;
    updateInvoice.mutate({ id: inv.id, status: newStatus, amount_paid: newPaid });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-secondary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title={`${labName} — Billing`} description="Lab invoices and payment tracking — independent from clinic billing">
        <Button size="sm" className="bg-secondary hover:bg-secondary/90" onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Lab Invoice
        </Button>
      </PageHeader>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        {[
          { label: "Total Lab Revenue", value: totalRevenue, icon: DollarSign, color: "text-primary", bg: "bg-primary/10" },
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

      {/* Invoices Table */}
      <Card className="glass-card">
        <CardHeader className="border-b border-border/30">
          <CardTitle className="text-base">Lab Invoices</CardTitle>
          <CardDescription>All lab invoices — independent from clinic invoicing</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {invoices.length === 0 ? (
            <EmptyState
              icon={DollarSign}
              title="No lab invoices yet"
              description="Create a lab invoice from a registered lab case."
              actionLabel="Create Invoice"
              onAction={() => setCreateOpen(true)}
            />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Clinic</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                    <TableHead className="text-right">Discount</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Deposit</TableHead>
                    <TableHead className="text-right">Paid</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-mono text-xs text-secondary">{inv.invoice_number}</TableCell>
                      <TableCell className="text-sm">{inv.clinic_doctor_name || inv.clinic_code || "—"}</TableCell>
                      <TableCell className="text-sm">{inv.patient_name || "—"}</TableCell>
                      <TableCell className="text-right text-sm">{fmt(Number(inv.subtotal))}</TableCell>
                      <TableCell className="text-right text-sm">{fmt(Number(inv.discount))}</TableCell>
                      <TableCell className="text-right text-sm font-medium">{fmt(Number(inv.total_amount))}</TableCell>
                      <TableCell className="text-right text-sm">{fmt(Number((inv as any).deposit_amount || 0))}</TableCell>
                      <TableCell className="text-right text-sm">{fmt(Number(inv.amount_paid))}</TableCell>
                      <TableCell className="text-right text-sm font-semibold">
                        <span className={Number(inv.total_amount) - Number(inv.amount_paid) > 0 ? "text-destructive" : "text-emerald-600"}>
                          {fmt(Number(inv.total_amount) - Number(inv.amount_paid))}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-[10px] ${statusStyles[inv.status] || ""}`}>
                          {inv.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant={inv.status === "paid" ? "outline" : "default"}
                            className="text-xs h-7"
                            onClick={() => togglePaid(inv)}
                            disabled={updateInvoice.isPending}
                          >
                            {inv.status === "paid" ? "Mark Unpaid" : "Mark Paid"}
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            title="Send to owner via WhatsApp"
                            asChild
                          >
                            <a
                              href={buildWhatsAppMessage(inv, clinicSettings?.phone, labName)}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
                            </a>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Invoice Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Lab Invoice</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>From Lab Case (optional)</Label>
              <Select value={selectedCaseId} onValueChange={(v) => {
                setSelectedCaseId(v);
                const c = labCases.find((x) => x.id === v);
                if (c) {
                  setManualSubtotal(Number(c.lab_fee));
                  setManualDiscount(Number(c.discount || 0));
                }
              }}>
                <SelectTrigger><SelectValue placeholder="Select a lab case" /></SelectTrigger>
                <SelectContent>
                  {labCases.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.case_number} — {c.work_type} ({c.patients ? `${c.patients.first_name} ${c.patients.last_name}` : "Unknown"})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Subtotal (₦)</Label>
                <Input type="number" value={selectedCase ? Number(selectedCase.lab_fee) : manualSubtotal}
                  onChange={(e) => setManualSubtotal(Number(e.target.value))} disabled={!!selectedCase} />
              </div>
              <div>
                <Label>Discount (₦)</Label>
                <Input type="number" value={selectedCase ? Number(selectedCase.discount || 0) : manualDiscount}
                  onChange={(e) => setManualDiscount(Number(e.target.value))} disabled={!!selectedCase} />
              </div>
            </div>
            <div>
              <Label>Amount Paid (₦)</Label>
              <Input type="number" value={manualPaid} onChange={(e) => setManualPaid(Number(e.target.value))} />
            </div>
            <div>
              <Label>Notes</Label>
              <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional notes" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={createInvoice.isPending}>
              {createInvoice.isPending ? "Creating..." : "Create Invoice"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
