import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, StickyNote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface PrescriptionTabProps {
  prescriptions: any[];
  patientId: string;
  canEdit?: boolean;
  userId?: string;
}

export function PrescriptionTab({ prescriptions, patientId, canEdit = false, userId }: PrescriptionTabProps) {
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [selectedRxId, setSelectedRxId] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const qc = useQueryClient();

  const openAddNote = (rxId: string, existingNote?: string) => {
    setSelectedRxId(rxId);
    setNote(existingNote || "");
    setNoteDialogOpen(true);
  };

  const handleSaveNote = async () => {
    if (!selectedRxId) return;
    setSaving(true);
    const { error } = await supabase.from("prescriptions").update({ notes: note }).eq("id", selectedRxId);
    setSaving(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Note saved" });
      qc.invalidateQueries({ queryKey: ["patient_prescriptions"] });
      setNoteDialogOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Prescriptions</h3>
      {prescriptions.length === 0 ? (
        <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">No prescriptions found.</CardContent></Card>
      ) : (
        prescriptions.map((rx: any) => (
          <Card key={rx.id} className="group">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm">{(rx.staff as any)?.full_name || "Unknown"}</CardTitle>
                  <CardDescription>{rx.prescription_date}{rx.diagnosis ? ` · ${rx.diagnosis}` : ""}</CardDescription>
                </div>
                {canEdit && (
                  <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => openAddNote(rx.id, rx.notes)}>
                    <StickyNote className="mr-1 h-3 w-3" /> {rx.notes ? "Edit Note" : "Add Note"}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {(rx.prescription_medications || []).map((med: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 p-2 rounded-md bg-muted/30">
                    <span className="h-5 w-5 rounded-full bg-secondary/20 text-secondary text-[10px] flex items-center justify-center font-medium shrink-0">{i + 1}</span>
                    <div>
                      <p className="text-sm font-medium">{med.name}</p>
                      <p className="text-xs text-muted-foreground">{med.dosage} · {med.frequency} · {med.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
              {rx.notes && <p className="text-xs text-muted-foreground mt-3 border-t pt-2"><StickyNote className="h-3 w-3 inline mr-1" />{rx.notes}</p>}
            </CardContent>
          </Card>
        ))
      )}

      {/* Add/Edit Note Dialog */}
      <Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Prescription Note</DialogTitle></DialogHeader>
          <div className="space-y-2">
            <Label className="text-xs">Note</Label>
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={4} placeholder="Add a note for this prescription..." />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNoteDialogOpen(false)}>Cancel</Button>
            <Button className="bg-secondary hover:bg-secondary/90" disabled={saving} onClick={handleSaveNote}>
              {saving ? "Saving..." : "Save Note"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
