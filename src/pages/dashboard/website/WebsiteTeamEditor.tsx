import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useWebsiteTeamMembers, useUpsertTeamMember, useDeleteTeamMember } from "@/hooks/useWebsiteContent";
import { toast } from "sonner";
import { Plus, Trash2, Edit, Users } from "lucide-react";

export default function WebsiteTeamEditor() {
  const { data: members, isLoading } = useWebsiteTeamMembers();
  const upsert = useUpsertTeamMember();
  const deleteMut = useDeleteTeamMember();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [bio, setBio] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [specialties, setSpecialties] = useState("");
  const [order, setOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const openNew = () => { setEditItem(null); setName(""); setRole(""); setBio(""); setImageUrl(""); setSpecialties(""); setOrder(0); setIsActive(true); setDialogOpen(true); };
  const openEdit = (m: any) => { setEditItem(m); setName(m.name); setRole(m.role); setBio(m.bio || ""); setImageUrl(m.image_url || ""); setSpecialties((m.specialties || []).join(", ")); setOrder(m.display_order); setIsActive(m.is_active); setDialogOpen(true); };
  const handleSave = () => {
    const payload: any = { name, role, bio: bio || null, image_url: imageUrl || null, specialties: specialties.split(",").map(s => s.trim()).filter(Boolean), display_order: order, is_active: isActive };
    if (editItem) payload.id = editItem.id;
    upsert.mutate(payload, { onSuccess: () => { toast.success("Saved"); setDialogOpen(false); }, onError: (e) => toast.error(e.message) });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Team Members Editor" description="Manage team profiles shown on the website" />
      <div className="flex justify-end"><Button onClick={openNew}><Plus className="h-4 w-4 mr-1" /> Add Member</Button></div>

      {isLoading ? <p className="text-center text-muted-foreground py-8">Loading...</p> : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {members?.map((m: any) => (
            <Card key={m.id} className={`group ${!m.is_active ? 'opacity-50' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  {m.image_url ? (
                    <img src={m.image_url} alt={m.name} className="h-14 w-14 rounded-full object-cover" />
                  ) : (
                    <div className="h-14 w-14 rounded-full bg-secondary/10 flex items-center justify-center"><Users className="h-7 w-7 text-secondary" /></div>
                  )}
                  <div>
                    <p className="font-medium">{m.name}</p>
                    <p className="text-sm text-muted-foreground">{m.role}</p>
                  </div>
                </div>
                {m.bio && <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{m.bio}</p>}
                {m.specialties?.length > 0 && (
                  <div className="flex flex-wrap gap-1">{m.specialties.map((s: string) => <span key={s} className="text-xs bg-secondary/10 text-secondary px-2 py-0.5 rounded">{s}</span>)}</div>
                )}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => openEdit(m)}><Edit className="h-3.5 w-3.5" /></Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => { if (confirm("Delete?")) deleteMut.mutate(m.id, { onSuccess: () => toast.success("Deleted") }); }}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {(!members || members.length === 0) && <p className="col-span-3 text-center text-muted-foreground py-8">No team members yet</p>}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editItem ? "Edit" : "Add"} Team Member</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
              <div><Label>Role / Title</Label><Input value={role} onChange={(e) => setRole(e.target.value)} /></div>
            </div>
            <div><Label>Bio</Label><Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} /></div>
            <div><Label>Specialties (comma-separated)</Label><Input value={specialties} onChange={(e) => setSpecialties(e.target.value)} placeholder="Implants, Orthodontics" /></div>
            <div><Label>Image URL</Label><Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} /></div>
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
