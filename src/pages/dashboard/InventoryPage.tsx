import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertTriangle, Plus, Pencil, Trash2, Package } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useInventory, useAddInventoryItem, useUpdateInventoryStock, useDeleteInventoryItem } from "@/hooks/useInventory";
import { EditInventoryDialog } from "@/components/dashboard/EditInventoryDialog";
import { useAuth } from "@/hooks/useAuth";
import type { InventoryItem } from "@/hooks/useInventory";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { TableSkeleton } from "@/components/dashboard/TableSkeleton";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const categories = ["Consumables", "Materials", "Medication", "Instruments", "General"];

export default function InventoryPage() {
  const { data: inventory = [], isLoading } = useInventory();
  const addItem = useAddInventoryItem();
  const updateStock = useUpdateInventoryStock();
  const deleteItem = useDeleteInventoryItem();
  const { roles } = useAuth();
  const isAdmin = roles.includes("admin");

  const [addOpen, setAddOpen] = useState(false);
  const [restockId, setRestockId] = useState<string | null>(null);
  const [restockQty, setRestockQty] = useState("");
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);

  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("General");
  const [newQuantity, setNewQuantity] = useState("");
  const [newMinStock, setNewMinStock] = useState("");
  const [newUnit, setNewUnit] = useState("pcs");
  const [newSupplier, setNewSupplier] = useState("");

  const lowStock = inventory.filter((i) => i.quantity <= i.min_stock);

  const handleAddItem = async () => {
    if (!newName.trim()) {
      toast({ title: "Name is required", variant: "destructive" });
      return;
    }
    try {
      await addItem.mutateAsync({
        name: newName,
        category: newCategory,
        quantity: parseInt(newQuantity) || 0,
        min_stock: parseInt(newMinStock) || 5,
        unit: newUnit,
        supplier: newSupplier,
        last_restocked: new Date().toISOString().split("T")[0],
      });
      toast({ title: "Item added" });
      setAddOpen(false);
      setNewName(""); setNewQuantity(""); setNewMinStock(""); setNewSupplier("");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleRestock = async () => {
    if (!restockId || !restockQty) return;
    const item = inventory.find((i) => i.id === restockId);
    if (!item) return;
    try {
      await updateStock.mutateAsync({ id: restockId, quantity: item.quantity + parseInt(restockQty) });
      toast({ title: "Stock updated" });
      setRestockId(null);
      setRestockQty("");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteItem.mutateAsync(id);
      toast({ title: "Item deleted" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory"
        description={`${inventory.length} items tracked`}
        badge={lowStock.length > 0 ? (
          <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-600 bg-amber-500/5">
            {lowStock.length} low stock
          </Badge>
        ) : undefined}
      >
        <Button size="sm" className="bg-secondary hover:bg-secondary/90 shadow-lg shadow-secondary/20" onClick={() => setAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Item
        </Button>
      </PageHeader>

      {lowStock.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-amber-500/20 bg-amber-500/5 glass-card">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Low Stock Alert</p>
                <p className="text-xs text-muted-foreground">{lowStock.map((i) => i.name).join(", ")} are running low.</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="glass-card overflow-hidden">
          <CardContent className="p-0">
            {isLoading ? (
              <TableSkeleton columns={7} rows={6} />
            ) : inventory.length === 0 ? (
              <EmptyState icon={Package} title="No inventory items" description="Add items to start tracking your inventory." actionLabel="Add Item" onAction={() => setAddOpen(true)} />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/20">
                      <th className="py-3 px-4 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider">Item</th>
                      <th className="py-3 px-4 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider">Category</th>
                      <th className="py-3 px-4 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider">Stock</th>
                      <th className="py-3 px-4 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider hidden md:table-cell">Min</th>
                      <th className="py-3 px-4 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider hidden md:table-cell">Supplier</th>
                      <th className="py-3 px-4 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider">Status</th>
                      <th className="py-3 px-4 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map((item, i) => {
                      const isLow = item.quantity <= item.min_stock;
                      return (
                        <motion.tr
                          key={item.id}
                          className="border-b border-border/30 last:border-0 hover:bg-accent/30 transition-all group"
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.02 }}
                        >
                          <td className="py-3 px-4 font-medium group-hover:text-secondary transition-colors">{item.name}</td>
                          <td className="py-3 px-4 text-muted-foreground">{item.category}</td>
                          <td className="py-3 px-4 font-semibold">{item.quantity} {item.unit}</td>
                          <td className="py-3 px-4 hidden md:table-cell text-muted-foreground">{item.min_stock}</td>
                          <td className="py-3 px-4 hidden md:table-cell text-muted-foreground">{item.supplier}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${isLow ? "bg-red-500/10 text-red-700 dark:text-red-400" : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"}`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${isLow ? "bg-red-500" : "bg-emerald-500"}`} />
                              {isLow ? "Low Stock" : "In Stock"}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              <Button variant="outline" size="sm" className="h-7 text-xs border-border/50 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => { setRestockId(item.id); setRestockQty(""); }}>
                                Restock
                              </Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setEditItem(item)}>
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              {isAdmin && (
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDelete(item.id)}>
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Add Item Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="backdrop-blur-xl bg-card/95">
          <DialogHeader><DialogTitle>Add Inventory Item</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs">Name *</Label>
              <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Latex Gloves" className="bg-muted/30" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Category</Label>
                <Select value={newCategory} onValueChange={setNewCategory}>
                  <SelectTrigger className="bg-muted/30"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Unit</Label>
                <Input value={newUnit} onChange={(e) => setNewUnit(e.target.value)} placeholder="pcs" className="bg-muted/30" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Quantity</Label>
                <Input type="number" value={newQuantity} onChange={(e) => setNewQuantity(e.target.value)} placeholder="0" className="bg-muted/30" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Min Stock</Label>
                <Input type="number" value={newMinStock} onChange={(e) => setNewMinStock(e.target.value)} placeholder="5" className="bg-muted/30" />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Supplier</Label>
              <Input value={newSupplier} onChange={(e) => setNewSupplier(e.target.value)} placeholder="Supplier name" className="bg-muted/30" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAddItem} className="bg-secondary hover:bg-secondary/90" disabled={addItem.isPending}>
              {addItem.isPending ? "Adding..." : "Add Item"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restock Dialog */}
      <Dialog open={!!restockId} onOpenChange={(open) => !open && setRestockId(null)}>
        <DialogContent className="backdrop-blur-xl bg-card/95">
          <DialogHeader><DialogTitle>Restock Item</DialogTitle></DialogHeader>
          <div className="space-y-1">
            <Label className="text-xs">Quantity to Add</Label>
            <Input type="number" min={1} value={restockQty} onChange={(e) => setRestockQty(e.target.value)} placeholder="Enter quantity" className="bg-muted/30" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRestockId(null)}>Cancel</Button>
            <Button onClick={handleRestock} className="bg-secondary hover:bg-secondary/90" disabled={updateStock.isPending}>
              {updateStock.isPending ? "Updating..." : "Update Stock"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <EditInventoryDialog item={editItem} open={!!editItem} onOpenChange={(o) => !o && setEditItem(null)} />
    </div>
  );
}