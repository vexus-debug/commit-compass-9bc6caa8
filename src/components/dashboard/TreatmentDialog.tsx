import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateTreatment, useUpdateTreatment, type Treatment } from "@/hooks/useTreatments";

const categories = ["General", "Cosmetic", "Orthodontics", "Restorative", "Surgical", "Periodontics", "Preventive"];

interface TreatmentDialogProps {
  treatment?: Treatment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TreatmentDialog({ treatment, open, onOpenChange }: TreatmentDialogProps) {
  const createTreatment = useCreateTreatment();
  const updateTreatment = useUpdateTreatment();
  const isEdit = !!treatment;

  const [form, setForm] = useState({ name: "", category: "General", price: "", duration: "", description: "" });

  useEffect(() => {
    if (treatment) {
      setForm({
        name: treatment.name,
        category: treatment.category,
        price: String(treatment.price),
        duration: treatment.duration || "",
        description: treatment.description || "",
      });
    } else {
      setForm({ name: "", category: "General", price: "", duration: "", description: "" });
    }
  }, [treatment, open]);

  const handleSubmit = async () => {
    if (!form.name.trim()) return;
    const payload = { name: form.name, category: form.category, price: parseFloat(form.price) || 0, duration: form.duration, description: form.description };
    if (isEdit && treatment) {
      await updateTreatment.mutateAsync({ id: treatment.id, ...payload });
    } else {
      await createTreatment.mutateAsync(payload);
    }
    onOpenChange(false);
  };

  const isPending = createTreatment.isPending || updateTreatment.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>{isEdit ? "Edit Treatment" : "Add Treatment"}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs">Name *</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Price (₦)</Label>
              <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Duration</Label>
            <Input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 30 mins" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Description</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} className="bg-secondary hover:bg-secondary/90" disabled={isPending}>
            {isPending ? "Saving..." : isEdit ? "Save Changes" : "Add Treatment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
