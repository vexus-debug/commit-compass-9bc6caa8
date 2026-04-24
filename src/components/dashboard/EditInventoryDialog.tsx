import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUpdateInventoryItem, useUpdateInventoryStock, type InventoryItem } from "@/hooks/useInventory";
import { toast } from "@/hooks/use-toast";

const categories = ["Consumables", "Materials", "Medication", "Instruments", "General"];

interface EditInventoryDialogProps {
  item: InventoryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditInventoryDialog({ item, open, onOpenChange }: EditInventoryDialogProps) {
  const updateItem = useUpdateInventoryItem();
  const updateStock = useUpdateInventoryStock();
  const [form, setForm] = useState({ name: "", category: "General", unit: "pcs", quantity: "0", min_stock: "5", supplier: "" });

  useEffect(() => {
    if (item) {
      setForm({
        name: item.name,
        category: item.category,
        unit: item.unit,
        quantity: String(item.quantity),
        min_stock: String(item.min_stock),
        supplier: item.supplier || "",
      });
    }
  }, [item]);

  const handleSave = async () => {
    if (!item || !form.name.trim()) {
      toast({ title: "Name is required", variant: "destructive" });
      return;
    }
    const newQty = parseInt(form.quantity) || 0;
    await Promise.all([
      updateItem.mutateAsync({
        id: item.id,
        name: form.name,
        category: form.category,
        unit: form.unit,
        min_stock: parseInt(form.min_stock) || 5,
        supplier: form.supplier,
      }),
      // Only update stock if quantity changed
      newQty !== item.quantity
        ? updateStock.mutateAsync({ id: item.id, quantity: newQty })
        : Promise.resolve(),
    ]);
    toast({ title: "Item updated" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Edit Inventory Item</DialogTitle></DialogHeader>
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
              <Label className="text-xs">Unit</Label>
              <Input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Quantity</Label>
              <Input type="number" min={0} value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Min Stock</Label>
              <Input type="number" value={form.min_stock} onChange={(e) => setForm({ ...form, min_stock: e.target.value })} />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Supplier</Label>
            <Input value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} className="bg-secondary hover:bg-secondary/90" disabled={updateItem.isPending || updateStock.isPending}>
            {updateItem.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
