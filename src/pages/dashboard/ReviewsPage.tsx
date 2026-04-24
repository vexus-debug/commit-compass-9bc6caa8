import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Plus, Search } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { usePatientReviews, useCreatePatientReview } from "@/hooks/usePatientReviews";
import { usePatients } from "@/hooks/usePatients";
import { useDentists } from "@/hooks/useStaff";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";

const serviceCategories = ["Cleanliness", "Professionalism", "Wait Time", "Pain Management", "Communication", "Overall Experience"];

export default function ReviewsPage() {
  const { data: reviews = [] } = usePatientReviews();
  const { data: patients = [] } = usePatients();
  const { data: dentists = [] } = useDentists();
  const { user } = useAuth();
  const createReview = useCreatePatientReview();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ patientId: "", dentistId: "", rating: 5, comments: "", categories: [] as string[] });

  const filtered = reviews.filter((r: any) => {
    const name = `${r.patients?.first_name} ${r.patients?.last_name}`.toLowerCase();
    return name.includes(search.toLowerCase());
  });

  const avgRating = reviews.length ? (reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length).toFixed(1) : "0.0";

  const handleSubmit = () => {
    if (!form.patientId || !form.rating) return;
    createReview.mutate({
      patient_id: form.patientId,
      dentist_id: form.dentistId || undefined,
      rating: form.rating,
      comments: form.comments,
      service_categories: form.categories,
      recorded_by: user?.id,
    }, {
      onSuccess: () => {
        setDialogOpen(false);
        setForm({ patientId: "", dentistId: "", rating: 5, comments: "", categories: [] });
      },
    });
  };

  const toggleCategory = (cat: string) => {
    setForm(f => ({
      ...f,
      categories: f.categories.includes(cat)
        ? f.categories.filter(c => c !== cat)
        : [...f.categories, cat],
    }));
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Patient Reviews" description="Track patient feedback and satisfaction">
        <Button onClick={() => setDialogOpen(true)} className="bg-secondary hover:bg-secondary/90">
          <Plus className="mr-2 h-4 w-4" /> Record Review
        </Button>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="glass-card">
            <CardContent className="pt-6 text-center">
              <p className="text-4xl font-bold text-secondary">{avgRating}</p>
              <div className="flex justify-center gap-0.5 my-2">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className={`h-4 w-4 ${i <= Math.round(Number(avgRating)) ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground/30"}`} />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">Average Rating</p>
            </CardContent>
          </Card>
        </motion.div>
        <Card className="glass-card">
          <CardContent className="pt-6 text-center">
            <p className="text-4xl font-bold">{reviews.length}</p>
            <p className="text-xs text-muted-foreground mt-2">Total Reviews</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="pt-6 text-center">
            <p className="text-4xl font-bold text-emerald-600">{reviews.filter((r: any) => r.rating >= 4).length}</p>
            <p className="text-xs text-muted-foreground mt-2">Positive (4-5 Stars)</p>
          </CardContent>
        </Card>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search by patient name..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">No reviews found.</CardContent></Card>
        ) : filtered.map((r: any) => (
          <Card key={r.id} className="glass-card">
            <CardContent className="py-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-sm">{r.patients?.first_name} {r.patients?.last_name}</p>
                  <p className="text-xs text-muted-foreground">{r.staff?.full_name || "N/A"} · {new Date(r.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className={`h-3.5 w-3.5 ${i <= r.rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground/30"}`} />
                  ))}
                </div>
              </div>
              {r.comments && <p className="text-sm mt-2 text-muted-foreground">{r.comments}</p>}
              {r.service_categories?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {r.service_categories.map((c: string) => (
                    <Badge key={c} variant="outline" className="text-[10px]">{c}</Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Record Patient Review</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs">Patient *</Label>
              <Select value={form.patientId} onValueChange={v => setForm(f => ({ ...f, patientId: v }))}>
                <SelectTrigger><SelectValue placeholder="Select patient" /></SelectTrigger>
                <SelectContent>
                  {patients.map(p => <SelectItem key={p.id} value={p.id}>{p.first_name} {p.last_name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Dentist</Label>
              <Select value={form.dentistId} onValueChange={v => setForm(f => ({ ...f, dentistId: v }))}>
                <SelectTrigger><SelectValue placeholder="Select dentist (optional)" /></SelectTrigger>
                <SelectContent>
                  {dentists.map(d => <SelectItem key={d.id} value={d.id}>{d.full_name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Rating *</Label>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(i => (
                  <button key={i} type="button" onClick={() => setForm(f => ({ ...f, rating: i }))}>
                    <Star className={`h-6 w-6 cursor-pointer transition-colors ${i <= form.rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground/30"}`} />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Service Categories</Label>
              <div className="flex flex-wrap gap-1">
                {serviceCategories.map(c => (
                  <Badge key={c} variant={form.categories.includes(c) ? "default" : "outline"} className="cursor-pointer text-xs" onClick={() => toggleCategory(c)}>
                    {c}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Comments</Label>
              <Textarea value={form.comments} onChange={e => setForm(f => ({ ...f, comments: e.target.value }))} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} className="bg-secondary hover:bg-secondary/90" disabled={createReview.isPending || !form.patientId}>
              {createReview.isPending ? "Saving..." : "Save Review"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
