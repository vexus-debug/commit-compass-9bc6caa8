import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, Package, AlertTriangle, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useLdInventory, useAddLdInventoryItem, useUpdateLdInventoryItem, useDeleteLdInventoryItem, LdInventoryItem } from "@/hooks/useLdInventory";
import { toast } from "@/components/ui/sonner";
import { motion } from "framer-motion";

const categories = ["general", "materials", "tools", "consumables", "equipment"];

const emptyForm = { name: "", category: "general", quantity: 0, unit: "pcs", min_stock: 5, supplier: "", notes: "" };

export default function LdInventoryPage() {
  const { data: items = [], isLoading } = useLdInventory();
  const addItem = useAddLdInventoryItem();
  const updateItem = useUpdateLdInventoryItem();
  const deleteItem = useDeleteLdInventoryItem();

  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<LdInventoryItem | null>(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = items.filter(i => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) || (i.supplier || "").toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "all" || i.category === catFilter;
    return matchSearch && matchCat;
  });

  const lowStock = items.filter(i => i.quantity <= i.min_stock);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (item: LdInventoryItem) => {
    setEditing(item);
    setForm({ name: item.name, category: item.category, quantity: item.quantity, unit: item.unit, min_stock: item.min_stock, supplier: item.supplier || "", notes: item.notes || "" });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    try {
      if (editing) {
        await updateItem.mutateAsync({ id: editing.id, ...form, last_restocked: form.quantity !== editing.quantity ? new Date().toISOString().split("T")[0] : editing.last_restocked });
        toast.success("Item updated");
      } else {
        await addItem.mutateAsync({ ...form, last_restocked: new Date().toISOString().split("T")[0] } as any);
        toast.success("Item added");
      }
      setDialogOpen(false);
    } catch { toast.error("Failed to save"); }
  };

  const handleDelete = async (id: string) => {
    try { await deleteItem.mutateAsync(id); toast.success("Item deleted"); } catch { toast.error("Failed to delete"); }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Inventory" description="Manage lab materials and supplies">
        <Button onClick={openAdd} size="sm"><Plus className="h-4 w-4 mr-1" /> Add Item</Button>
      </PageHeader>

      {lowStock.length > 0 && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-700 dark:text-amber-400">{lowStock.length} item(s) below minimum stock</p>
              <p className="text-xs text-muted-foreground">{lowStock.map(i => i.name).join(", ")}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search items..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={catFilter} onValueChange={setCatFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="glass-card">
          <CardContent className="p-0">
            {isLoading ? (
              <p className="text-sm text-muted-foreground py-10 text-center">Loading...</p>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center py-12 gap-2">
                <Package className="h-10 w-10 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">No inventory items found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="p-3 font-medium">Name</th>
                      <th className="p-3 font-medium">Category</th>
                      <th className="p-3 font-medium text-right">Qty</th>
                      <th className="p-3 font-medium">Unit</th>
                      <th className="p-3 font-medium">Supplier</th>
                      <th className="p-3 font-medium">Status</th>
                      <th className="p-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(item => (
                      <tr key={item.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                        <td className="p-3 font-medium">{item.name}</td>
                        <td className="p-3"><Badge variant="secondary" className="text-[10px] capitalize">{item.category}</Badge></td>
                        <td className="p-3 text-right font-mono">{item.quantity}</td>
                        <td className="p-3 text-muted-foreground">{item.unit}</td>
                        <td className="p-3 text-muted-foreground">{item.supplier || "—"}</td>
                        <td className="p-3">
                          {item.quantity <= item.min_stock ? (
                            <Badge variant="destructive" className="text-[10px]">Low Stock</Badge>
                          ) : (
                            <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-300">In Stock</Badge>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex gap-1 justify-end">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(item)}><Pencil className="h-3.5 w-3.5" /></Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(item.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editing ? "Edit Item" : "Add Item"}</DialogTitle></DialogHeader>
          <div className="grid gap-3">
            <div><Label>Name *</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Category</Label>
                <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{categories.map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Unit</Label><Input value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Quantity</Label><Input type="number" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: +e.target.value }))} /></div>
              <div><Label>Min Stock</Label><Input type="number" value={form.min_stock} onChange={e => setForm(f => ({ ...f, min_stock: +e.target.value }))} /></div>
            </div>
            <div><Label>Supplier</Label><Input value={form.supplier} onChange={e => setForm(f => ({ ...f, supplier: e.target.value }))} /></div>
            <div>
              <Label>Notes / Restock Log</Label>
              <Textarea
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                rows={4}
                placeholder="e.g., Restocked 50 pcs on 07/04/2026 from ABC Supplies. Next restock due mid-May..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={addItem.isPending || updateItem.isPending}>{editing ? "Update" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
