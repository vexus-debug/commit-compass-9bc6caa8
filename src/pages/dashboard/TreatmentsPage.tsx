import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Pencil, Trash2, Stethoscope } from "lucide-react";
import { useTreatments, useDeleteTreatment, type Treatment } from "@/hooks/useTreatments";
import { TreatmentDialog } from "@/components/dashboard/TreatmentDialog";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.04 } } },
  item: { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } },
};

export default function TreatmentsPage() {
  const [search, setSearch] = useState("");
  const { data: treatments = [], isLoading } = useTreatments();
  const deleteTreatment = useDeleteTreatment();
  const { roles } = useAuth();
  const isAdmin = roles.includes("admin");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTreatment, setEditTreatment] = useState<Treatment | null>(null);

  const filtered = treatments.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase()));
  const categories = [...new Set(treatments.map((t) => t.category))];

  const handleDelete = async (id: string) => {
    await deleteTreatment.mutateAsync(id);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Treatments & Procedures" description="Treatment catalog with pricing">
        {isAdmin && (
          <Button size="sm" className="bg-secondary hover:bg-secondary/90 shadow-lg shadow-secondary/20" onClick={() => { setEditTreatment(null); setDialogOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" /> Add Treatment
          </Button>
        )}
      </PageHeader>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search treatments..." className="pl-9 bg-muted/30 border-border/40" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="glass-card"><CardContent className="p-4 space-y-2"><Skeleton className="h-4 w-32" /><Skeleton className="h-3 w-full" /><Skeleton className="h-4 w-20" /></CardContent></Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Stethoscope} title="No treatments found" description="Add treatments to your catalog to start managing procedures and pricing." actionLabel="Add Treatment" onAction={() => { setEditTreatment(null); setDialogOpen(true); }} />
      ) : (
        categories.map((cat) => {
          const catTreatments = filtered.filter((t) => t.category === cat);
          if (catTreatments.length === 0) return null;
          return (
            <div key={cat}>
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">{cat}</h2>
              <motion.div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" variants={stagger.container} initial="hidden" animate="visible">
                {catTreatments.map((t) => (
                  <motion.div key={t.id} variants={stagger.item}>
                    <Card className="glass-card hover:shadow-lg hover:shadow-secondary/5 transition-all duration-300 group hover:border-secondary/20">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-sm group-hover:text-secondary transition-colors">{t.name}</p>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{t.description}</p>
                          </div>
                          {isAdmin && (
                            <div className="flex gap-1 shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditTreatment(t); setDialogOpen(true); }}>
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600" onClick={() => handleDelete(t.id)}>
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          )}
                        </div>
                        <div className="flex justify-between items-center mt-3 pt-2 border-t border-border/30">
                          <span className="text-sm font-bold text-secondary">₦{t.price.toLocaleString()}</span>
                          <span className="text-[10px] text-muted-foreground font-mono">{t.duration}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          );
        })
      )}

      <TreatmentDialog treatment={editTreatment} open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}