import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Calculator, Plus, Trash2 } from "lucide-react";
import { useTreatments } from "@/hooks/useTreatments";
import { useCreateInvoice } from "@/hooks/useInvoices";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

interface TreatmentTabProps {
  plans: any[];
  visits: any[];
  patientId?: string;
  roles?: string[];
}

function formatCurrency(amount: number) {
  return `₦${amount.toLocaleString()}`;
}

const paymentMethods = ["Cash", "Bank Transfer", "POS", "Card"];

export function TreatmentTab({ plans, visits, patientId, roles = [] }: TreatmentTabProps) {
  const { data: treatments = [] } = useTreatments();
  const createInvoice = useCreateInvoice();
  const [priceListOpen, setPriceListOpen] = useState(false);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const isDentist = roles.includes("dentist");

  // Invoice builder state
  const [selectedItems, setSelectedItems] = useState<{ treatmentId: string; quantity: number }[]>([]);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [amountPaid, setAmountPaid] = useState(0);

  // Group treatments by category for the price list
  const grouped = treatments.reduce((acc, t) => {
    const cat = t.category || "Uncategorized";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(t);
    return acc;
  }, {} as Record<string, typeof treatments>);

  const addToInvoice = (treatmentId: string) => {
    setSelectedItems(prev => {
      const existing = prev.find(i => i.treatmentId === treatmentId);
      if (existing) return prev.map(i => i.treatmentId === treatmentId ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { treatmentId, quantity: 1 }];
    });
  };

  const removeFromInvoice = (index: number) => {
    setSelectedItems(prev => prev.filter((_, i) => i !== index));
  };

  const subtotal = selectedItems.reduce((sum, item) => {
    const t = treatments.find(tr => tr.id === item.treatmentId);
    return sum + (Number(t?.price) || 0) * item.quantity;
  }, 0);
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;

  const handleGenerateInvoice = async () => {
    if (!patientId || selectedItems.length === 0 || !paymentMethod) return;
    const lineItems = selectedItems.map(item => {
      const t = treatments.find(tr => tr.id === item.treatmentId);
      return {
        treatment_id: item.treatmentId,
        description: t?.name || "",
        quantity: item.quantity,
        unit_price: Number(t?.price) || 0,
        line_total: (Number(t?.price) || 0) * item.quantity,
      };
    });
    try {
      await createInvoice.mutateAsync({
        patient_id: patientId,
        discount_percent: discount,
        payment_method: paymentMethod,
        amount_paid: Math.min(amountPaid, total),
        line_items: lineItems,
      });
      toast({ title: "Invoice generated", description: `${formatCurrency(total)} invoice created.` });
      setInvoiceOpen(false);
      setSelectedItems([]);
      setDiscount(0);
      setPaymentMethod("");
      setAmountPaid(0);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const openInvoiceFromPriceList = () => {
    setPriceListOpen(false);
    setInvoiceOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Action buttons for dentists */}
      {isDentist && patientId && (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setPriceListOpen(true)}>
            <Calculator className="mr-1 h-3.5 w-3.5" /> Treatment Price List
          </Button>
          <Button size="sm" className="bg-secondary hover:bg-secondary/90" onClick={() => setInvoiceOpen(true)}>
            <Plus className="mr-1 h-3.5 w-3.5" /> Generate Invoice
          </Button>
        </div>
      )}

      {/* Treatment Plans */}
      <div>
        <h3 className="text-sm font-medium mb-3">Treatment Plans</h3>
        {plans.length === 0 ? (
          <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">No treatment plans found.</CardContent></Card>
        ) : (
          <div className="space-y-4">
            {plans.map((plan: any) => {
              const procs = plan.treatment_plan_procedures || [];
              const completedCount = procs.filter((p: any) => p.status === "done").length;
              const progress = procs.length ? Math.round((completedCount / procs.length) * 100) : 0;
              return (
                <Card key={plan.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-sm">{plan.name}</CardTitle>
                        <CardDescription>{plan.start_date} → {plan.estimated_end || "Ongoing"}</CardDescription>
                      </div>
                      <Badge className={plan.status === "active" ? "bg-blue-100 text-blue-700" : plan.status === "completed" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-700"}>
                        {plan.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Progress value={progress} className="flex-1 h-2" />
                      <span className="text-xs font-medium">{progress}%</span>
                    </div>
                    <div className="space-y-2">
                      {procs.map((proc: any, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <span className={`h-2 w-2 rounded-full ${proc.status === "done" ? "bg-emerald-500" : "bg-gray-300"}`} />
                          <span className={proc.status === "done" ? "line-through text-muted-foreground" : ""}>{proc.procedure_name}</span>
                          {proc.estimated_cost && <span className="ml-auto text-xs text-muted-foreground">{formatCurrency(Number(proc.estimated_cost))}</span>}
                          {proc.completed_date && <span className="text-xs text-muted-foreground">{proc.completed_date}</span>}
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-xs border-t pt-2">
                      <span className="text-muted-foreground">Total: {formatCurrency(Number(plan.total_cost))}</span>
                      <span className="text-muted-foreground">Paid: {formatCurrency(Number(plan.paid_amount))}</span>
                      <span className="font-medium text-destructive">Due: {formatCurrency(Number(plan.total_cost) - Number(plan.paid_amount))}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Visit History */}
      <div>
        <h3 className="text-sm font-medium mb-3">Completed Visits</h3>
        {visits.length === 0 ? (
          <Card><CardContent className="py-6 text-center text-sm text-muted-foreground">No completed visits found.</CardContent></Card>
        ) : (
          <Card>
            <CardContent className="py-4">
              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-border">
                {visits.map((v: any) => (
                  <div key={v.id} className="relative">
                    <div className="absolute -left-6 top-1 h-4 w-4 rounded-full border-2 border-secondary bg-background" />
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-sm">{v.treatment}</p>
                        <p className="text-xs text-muted-foreground">{v.dentist} · {v.date}</p>
                        {v.notes && <p className="text-xs text-muted-foreground mt-1">{v.notes}</p>}
                      </div>
                      <span className="text-sm font-medium shrink-0">{formatCurrency(v.cost)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Treatment Price List Dialog (read-only calculator preview) */}
      <Dialog open={priceListOpen} onOpenChange={setPriceListOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Calculator className="h-4 w-4" /> Treatment Price List</DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground">Click on treatments to add them to the calculator. This preview cannot be saved.</p>
          <div className="space-y-4">
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{category}</h4>
                <div className="space-y-1">
                  {items.map(t => {
                    const count = selectedItems.find(i => i.treatmentId === t.id)?.quantity || 0;
                    return (
                      <div
                        key={t.id}
                        className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-accent/50 cursor-pointer transition-colors"
                        onClick={() => addToInvoice(t.id)}
                      >
                        <span className="text-sm">{t.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{formatCurrency(Number(t.price))}</span>
                          {count > 0 && (
                            <Badge variant="secondary" className="text-[10px] h-5">{count}×</Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {selectedItems.length > 0 && (
            <>
              <Separator />
              <div className="rounded-lg border p-3 bg-muted/30 space-y-1">
                <p className="text-xs font-medium text-muted-foreground mb-2">Calculator Preview</p>
                {selectedItems.map((item, idx) => {
                  const t = treatments.find(tr => tr.id === item.treatmentId);
                  return (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>{t?.name} × {item.quantity}</span>
                      <span>{formatCurrency((Number(t?.price) || 0) * item.quantity)}</span>
                    </div>
                  );
                })}
                <Separator className="my-1" />
                <div className="flex justify-between font-bold text-sm">
                  <span>Estimated Total</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedItems([])}>Clear</Button>
                <Button size="sm" className="bg-secondary hover:bg-secondary/90" onClick={openInvoiceFromPriceList}>
                  Proceed to Invoice
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Generate Invoice Dialog */}
      <Dialog open={invoiceOpen} onOpenChange={setInvoiceOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Generate Invoice</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Selected items */}
            <div className="space-y-2">
              <Label className="text-xs">Treatment Items</Label>
              {selectedItems.map((item, idx) => {
                const t = treatments.find(tr => tr.id === item.treatmentId);
                return (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="flex-1 text-sm">{t?.name}</span>
                    <Input
                      type="number"
                      min={1}
                      className="w-16 h-8 text-xs"
                      value={item.quantity}
                      onChange={(e) => {
                        const q = parseInt(e.target.value) || 1;
                        setSelectedItems(prev => prev.map((si, i) => i === idx ? { ...si, quantity: q } : si));
                      }}
                    />
                    <span className="text-sm font-medium w-24 text-right">{formatCurrency((Number(t?.price) || 0) * item.quantity)}</span>
                    <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeFromInvoice(idx)}>
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </div>
                );
              })}
              <Select onValueChange={(v) => addToInvoice(v)}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="+ Add treatment item" />
                </SelectTrigger>
                <SelectContent>
                  {treatments.map(t => (
                    <SelectItem key={t.id} value={t.id}>{t.name} — {formatCurrency(Number(t.price))}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Discount (%)</Label>
                <Input type="number" min={0} max={100} value={discount} onChange={(e) => setDiscount(Number(e.target.value))} className="h-8" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Payment Method *</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger className="h-8"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Amount Paid</Label>
              <Input type="number" min={0} value={amountPaid} onChange={(e) => setAmountPaid(Number(e.target.value))} className="h-8" />
            </div>

            {/* Summary */}
            <div className="rounded-lg border p-3 bg-muted/30 space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
              {discount > 0 && (
                <div className="flex justify-between text-destructive"><span>Discount ({discount}%)</span><span>-{formatCurrency(discountAmount)}</span></div>
              )}
              <Separator className="my-1" />
              <div className="flex justify-between font-bold"><span>Total</span><span>{formatCurrency(total)}</span></div>
              <div className="flex justify-between text-muted-foreground">
                <span>Balance Due</span>
                <span>{formatCurrency(Math.max(0, total - amountPaid))}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInvoiceOpen(false)}>Cancel</Button>
            <Button
              className="bg-secondary hover:bg-secondary/90"
              disabled={createInvoice.isPending || selectedItems.length === 0 || !paymentMethod}
              onClick={handleGenerateInvoice}
            >
              {createInvoice.isPending ? "Creating..." : "Generate Invoice"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
