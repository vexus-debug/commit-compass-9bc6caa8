import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil } from "lucide-react";
import { useLdWorkTypes, useCreateLdWorkType, useUpdateLdWorkType } from "@/hooks/useLabDashboard";

export default function LdWorkTypesPage() {
  const { data: workTypes = [], isLoading } = useLdWorkTypes();
  const createWt = useCreateLdWorkType();
  const updateWt = useUpdateLdWorkType();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editWt, setEditWt] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const values = {
      name: fd.get("name") as string,
      category: fd.get("category") as string,
      description: fd.get("description") as string,
      base_price: Number(fd.get("base_price") || 0),
      estimated_days: Number(fd.get("estimated_days") || 3),
      is_active: fd.get("is_active") === "on",
    };
    if (editWt) {
      updateWt.mutate({ id: editWt.id, ...values }, { onSuccess: () => { setDialogOpen(false); setEditWt(null); } });
    } else {
      createWt.mutate(values, { onSuccess: () => setDialogOpen(false) });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Work Types</h1>
          <p className="text-sm text-muted-foreground">Lab services and procedures offered</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) setEditWt(null); }}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-1" /> Add Work Type</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editWt ? "Edit Work Type" : "Add Work Type"}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2"><Label>Name *</Label><Input name="name" required defaultValue={editWt?.name || ""} /></div>
                <div>
                  <Label>Category</Label>
                  <select name="category" className="w-full border rounded-md p-2 text-sm bg-background" defaultValue={editWt?.category || "general"}>
                    <option value="general">General</option>
                    <option value="crown_bridge">Crown & Bridge</option>
                    <option value="orthodontics">Orthodontics</option>
                    <option value="implant">Implant</option>
                    <option value="denture">Denture</option>
                    <option value="ceramic">Ceramic</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div><Label>Base Price (₦)</Label><Input name="base_price" type="number" step="0.01" defaultValue={editWt?.base_price || 0} /></div>
                <div><Label>Est. Days</Label><Input name="estimated_days" type="number" defaultValue={editWt?.estimated_days || 3} /></div>
                <div className="flex items-center gap-2 pt-5">
                  <Label>Active</Label>
                  <Switch name="is_active" defaultChecked={editWt?.is_active ?? true} />
                </div>
                <div className="col-span-2"><Label>Description</Label><Input name="description" defaultValue={editWt?.description || ""} /></div>
              </div>
              <Button type="submit" className="w-full">{editWt ? "Update" : "Add Work Type"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/30">
                  <th className="text-left p-3 font-medium text-muted-foreground">Name</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Category</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Base Price</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Est. Days</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Loading...</td></tr>
                ) : !workTypes.length ? (
                  <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No work types found</td></tr>
                ) : workTypes.map((w: any) => (
                  <tr key={w.id} className="border-b border-border/30 hover:bg-muted/20">
                    <td className="p-3 font-medium">{w.name}</td>
                    <td className="p-3 capitalize text-xs">{w.category.replace("_", " & ")}</td>
                    <td className="p-3 text-right">₦{Number(w.base_price).toLocaleString()}</td>
                    <td className="p-3 text-right">{w.estimated_days}</td>
                    <td className="p-3"><Badge variant={w.is_active ? "default" : "secondary"}>{w.is_active ? "Active" : "Inactive"}</Badge></td>
                    <td className="p-3 text-right">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditWt(w); setDialogOpen(true); }}><Pencil className="h-3.5 w-3.5" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
