import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useWebsiteFaqs, useUpsertFaq, useDeleteFaq } from "@/hooks/useWebsiteContent";
import { toast } from "sonner";
import { Plus, Trash2, Edit, HelpCircle } from "lucide-react";

export default function WebsiteFaqsEditor() {
  const { data: faqs, isLoading } = useWebsiteFaqs();
  const upsert = useUpsertFaq();
  const deleteMut = useDeleteFaq();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("General");
  const [order, setOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const openNew = () => { setEditItem(null); setQuestion(""); setAnswer(""); setCategory("General"); setOrder(0); setIsActive(true); setDialogOpen(true); };
  const openEdit = (f: any) => { setEditItem(f); setQuestion(f.question); setAnswer(f.answer); setCategory(f.category); setOrder(f.display_order); setIsActive(f.is_active); setDialogOpen(true); };
  const handleSave = () => {
    const payload: any = { question, answer, category, display_order: order, is_active: isActive };
    if (editItem) payload.id = editItem.id;
    upsert.mutate(payload, { onSuccess: () => { toast.success("Saved"); setDialogOpen(false); }, onError: (e) => toast.error(e.message) });
  };

  const grouped = faqs?.reduce((acc: any, f: any) => {
    if (!acc[f.category]) acc[f.category] = [];
    acc[f.category].push(f);
    return acc;
  }, {} as Record<string, any[]>) || {};

  return (
    <div className="space-y-6">
      <PageHeader title="FAQ Editor" description="Manage frequently asked questions on the website" />
      <div className="flex justify-end"><Button onClick={openNew}><Plus className="h-4 w-4 mr-1" /> Add FAQ</Button></div>

      {isLoading ? <p className="text-center text-muted-foreground py-8">Loading...</p> : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([cat, items]: [string, any]) => (
            <div key={cat}>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2"><HelpCircle className="h-5 w-5 text-secondary" />{cat}</h3>
              <div className="space-y-2">
                {items.map((f: any) => (
                  <Card key={f.id} className={`group ${!f.is_active ? 'opacity-50' : ''}`}>
                    <CardContent className="p-4 flex items-start gap-3">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{f.question}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{f.answer}</p>
                      </div>
                      <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => openEdit(f)}><Edit className="h-3.5 w-3.5" /></Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => { if (confirm("Delete?")) deleteMut.mutate(f.id, { onSuccess: () => toast.success("Deleted") }); }}><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
          {Object.keys(grouped).length === 0 && <p className="text-center text-muted-foreground py-8">No FAQs yet</p>}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editItem ? "Edit" : "Add"} FAQ</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Question</Label><Input value={question} onChange={(e) => setQuestion(e.target.value)} /></div>
            <div><Label>Answer</Label><Textarea value={answer} onChange={(e) => setAnswer(e.target.value)} rows={4} /></div>
            <div className="grid grid-cols-3 gap-3">
              <div><Label>Category</Label><Input value={category} onChange={(e) => setCategory(e.target.value)} /></div>
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
