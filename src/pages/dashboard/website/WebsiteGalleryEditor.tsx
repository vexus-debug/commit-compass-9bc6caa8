import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useWebsiteGallery, useUpsertGalleryItem, useDeleteGalleryItem } from "@/hooks/useWebsiteContent";
import { toast } from "sonner";
import { Plus, Trash2, Edit, Image as ImageIcon } from "lucide-react";

export default function WebsiteGalleryEditor() {
  const { data: gallery, isLoading } = useWebsiteGallery();
  const upsert = useUpsertGalleryItem();
  const deleteMut = useDeleteGalleryItem();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [beforeImageUrl, setBeforeImageUrl] = useState("");
  const [category, setCategory] = useState("clinic");
  const [order, setOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const openNew = () => { setEditItem(null); setTitle(""); setDescription(""); setImageUrl(""); setBeforeImageUrl(""); setCategory("clinic"); setOrder(0); setIsActive(true); setDialogOpen(true); };
  const openEdit = (g: any) => { setEditItem(g); setTitle(g.title); setDescription(g.description || ""); setImageUrl(g.image_url); setBeforeImageUrl(g.before_image_url || ""); setCategory(g.category); setOrder(g.display_order); setIsActive(g.is_active); setDialogOpen(true); };
  const handleSave = () => {
    const payload: any = { title, description: description || null, image_url: imageUrl, before_image_url: beforeImageUrl || null, category, display_order: order, is_active: isActive };
    if (editItem) payload.id = editItem.id;
    upsert.mutate(payload, { onSuccess: () => { toast.success("Saved"); setDialogOpen(false); }, onError: (e) => toast.error(e.message) });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Gallery Editor" description="Manage gallery images and before/after photos" />
      <div className="flex justify-end"><Button onClick={openNew}><Plus className="h-4 w-4 mr-1" /> Add Image</Button></div>

      {isLoading ? <p className="text-center text-muted-foreground py-8">Loading...</p> : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {gallery?.map((g: any) => (
            <Card key={g.id} className={`group overflow-hidden ${!g.is_active ? 'opacity-50' : ''}`}>
              <div className="aspect-video bg-muted relative">
                {g.image_url ? <img src={g.image_url} alt={g.title} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full"><ImageIcon className="h-12 w-12 text-muted-foreground/30" /></div>}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <Button size="icon" variant="secondary" className="h-7 w-7" onClick={() => openEdit(g)}><Edit className="h-3.5 w-3.5" /></Button>
                  <Button size="icon" variant="destructive" className="h-7 w-7" onClick={() => { if (confirm("Delete?")) deleteMut.mutate(g.id, { onSuccess: () => toast.success("Deleted") }); }}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
                <span className="absolute bottom-2 left-2 text-xs bg-background/80 px-2 py-0.5 rounded">{g.category}</span>
              </div>
              <CardContent className="p-3">
                <p className="font-medium text-sm">{g.title}</p>
                {g.description && <p className="text-xs text-muted-foreground">{g.description}</p>}
              </CardContent>
            </Card>
          ))}
          {(!gallery || gallery.length === 0) && <p className="col-span-3 text-center text-muted-foreground py-8">No gallery items yet</p>}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editItem ? "Edit" : "Add"} Gallery Image</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
            <div><Label>Description</Label><Input value={description} onChange={(e) => setDescription(e.target.value)} /></div>
            <div>
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="clinic">Clinic</SelectItem>
                  <SelectItem value="before_after">Before & After</SelectItem>
                  <SelectItem value="team">Team</SelectItem>
                  <SelectItem value="equipment">Equipment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Image URL (After)</Label><Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} /></div>
            {category === "before_after" && <div><Label>Before Image URL</Label><Input value={beforeImageUrl} onChange={(e) => setBeforeImageUrl(e.target.value)} /></div>}
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Order</Label><Input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} /></div>
              <div className="flex items-center gap-2 pt-6"><Switch checked={isActive} onCheckedChange={setIsActive} /><Label>Active</Label></div>
            </div>
            <Button onClick={handleSave} disabled={upsert.isPending} className="w-full">Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
