import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useWebsiteTestimonials, useUpsertTestimonial, useDeleteTestimonial } from "@/hooks/useWebsiteContent";
import { toast } from "sonner";
import { Plus, Trash2, Star, Edit, Quote } from "lucide-react";

export default function WebsiteTestimonialsEditor() {
  const { data: testimonials, isLoading } = useWebsiteTestimonials();
  const upsert = useUpsertTestimonial();
  const deleteMut = useDeleteTestimonial();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [imageUrl, setImageUrl] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [order, setOrder] = useState(0);

  const openNew = () => {
    setEditItem(null); setName(""); setRole(""); setText(""); setRating(5); setImageUrl(""); setIsFeatured(false); setOrder(0);
    setDialogOpen(true);
  };
  const openEdit = (t: any) => {
    setEditItem(t); setName(t.name); setRole(t.role); setText(t.text); setRating(t.rating); setImageUrl(t.image_url || ""); setIsFeatured(t.is_featured); setOrder(t.display_order);
    setDialogOpen(true);
  };
  const handleSave = () => {
    const payload: any = { name, role, text, rating, image_url: imageUrl || null, is_featured: isFeatured, display_order: order };
    if (editItem) payload.id = editItem.id;
    upsert.mutate(payload, { onSuccess: () => { toast.success("Saved"); setDialogOpen(false); }, onError: (e) => toast.error(e.message) });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Testimonials Editor" description="Manage patient testimonials shown on the website" />
      <div className="flex justify-end">
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-1" /> Add Testimonial</Button>
      </div>

      {isLoading ? <p className="text-center text-muted-foreground py-8">Loading...</p> : (
        <div className="grid gap-4 md:grid-cols-2">
          {testimonials?.map((t: any) => (
            <Card key={t.id} className="relative group">
              <CardContent className="p-5">
                <Quote className="h-6 w-6 text-secondary/30 mb-2" />
                <div className="flex gap-1 mb-2">{Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}</div>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-3">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  {t.image_url && <img src={t.image_url} alt={t.name} className="h-10 w-10 rounded-full object-cover" />}
                  <div>
                    <p className="font-medium text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                  {t.is_featured && <span className="ml-auto text-xs bg-secondary/10 text-secondary px-2 py-0.5 rounded-full">Featured</span>}
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => openEdit(t)}><Edit className="h-3.5 w-3.5" /></Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => { if (confirm("Delete?")) deleteMut.mutate(t.id, { onSuccess: () => toast.success("Deleted") }); }}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {(!testimonials || testimonials.length === 0) && <p className="col-span-2 text-center text-muted-foreground py-8">No testimonials yet</p>}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editItem ? "Edit" : "Add"} Testimonial</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
              <div><Label>Service / Role</Label><Input value={role} onChange={(e) => setRole(e.target.value)} /></div>
            </div>
            <div><Label>Testimonial Text</Label><Textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} /></div>
            <div className="grid grid-cols-3 gap-3">
              <div><Label>Rating</Label><Input type="number" min={1} max={5} value={rating} onChange={(e) => setRating(Number(e.target.value))} /></div>
              <div><Label>Order</Label><Input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} /></div>
              <div className="flex items-center gap-2 pt-6"><Switch checked={isFeatured} onCheckedChange={setIsFeatured} /><Label>Featured</Label></div>
            </div>
            <div><Label>Image URL</Label><Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." /></div>
            <Button onClick={handleSave} disabled={upsert.isPending} className="w-full">Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
