import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Paperclip, Image as ImageIcon } from "lucide-react";
import { useCreateClinicalNote, useUpdateClinicalNote } from "@/hooks/useClinicalNotes";
import { usePatientImages, useUploadPatientImage } from "@/hooks/usePatientImages";

interface DiagnosisTabProps {
  patientId: string;
  clinicalNotes: any[];
  canEdit: boolean;
  userId?: string;
}

export function DiagnosisTab({ patientId, clinicalNotes, canEdit, userId }: DiagnosisTabProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<any>(null);
  const [form, setForm] = useState({ subjective: "", objective: "", assessment: "", plan: "" });
  const [attachments, setAttachments] = useState<File[]>([]);
  const createNote = useCreateClinicalNote();
  const updateNote = useUpdateClinicalNote();
  const uploadImage = useUploadPatientImage();
  const { data: allImages = [] } = usePatientImages(patientId);

  const openNew = () => {
    setEditingNote(null);
    setForm({ subjective: "", objective: "", assessment: "", plan: "" });
    setAttachments([]);
    setDialogOpen(true);
  };

  const openEdit = (note: any) => {
    setEditingNote(note);
    setForm({
      subjective: note.subjective || "",
      objective: note.objective || "",
      assessment: note.assessment || "",
      plan: note.plan || "",
    });
    setAttachments([]);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    let noteId: string | undefined;

    if (editingNote) {
      await updateNote.mutateAsync({ id: editingNote.id, ...form });
      noteId = editingNote.id;
    } else {
      const result = await createNote.mutateAsync(
        { patient_id: patientId, ...form, created_by: userId }
      );
      noteId = result?.id;
    }

    // Upload attachments linked to this note
    if (noteId && attachments.length > 0) {
      for (const file of attachments) {
        await uploadImage.mutateAsync({
          file,
          patientId,
          imageType: "clinical-photo",
          description: `Attached to SOAP note`,
          userId,
          clinicalNoteId: noteId,
        });
      }
    }

    setDialogOpen(false);
    setEditingNote(null);
    setAttachments([]);
  };

  const isPending = createNote.isPending || updateNote.isPending || uploadImage.isPending;

  // Get images linked to a specific note
  const getNoteImages = (noteId: string) =>
    allImages.filter((img: any) => img.clinical_note_id === noteId);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">SOAP Notes / Clinical Diagnosis</h3>
        {canEdit && (
          <Button size="sm" variant="outline" onClick={openNew}>
            <Plus className="mr-1 h-3 w-3" /> Add Note
          </Button>
        )}
      </div>

      {clinicalNotes.length === 0 ? (
        <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">No clinical notes found.</CardContent></Card>
      ) : (
        clinicalNotes.map((note: any) => {
          const noteImages = getNoteImages(note.id);
          return (
            <Card key={note.id} className="group">
              <CardContent className="py-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">{new Date(note.created_at).toLocaleDateString()}</p>
                  {canEdit && (
                    <Button size="icon" variant="ghost" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => openEdit(note)}>
                      <Pencil className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                {note.subjective && <div><span className="text-xs font-semibold text-muted-foreground">S: </span><span className="text-sm">{note.subjective}</span></div>}
                {note.objective && <div><span className="text-xs font-semibold text-muted-foreground">O: </span><span className="text-sm">{note.objective}</span></div>}
                {note.assessment && <div><span className="text-xs font-semibold text-muted-foreground">A: </span><span className="text-sm">{note.assessment}</span></div>}
                {note.plan && <div><span className="text-xs font-semibold text-muted-foreground">P: </span><span className="text-sm">{note.plan}</span></div>}

                {/* Attached Images */}
                {noteImages.length > 0 && (
                  <div className="border-t pt-2 mt-2">
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                      <Paperclip className="h-3 w-3" /> {noteImages.length} attachment(s)
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {noteImages.map((img: any) => (
                        <a key={img.id} href={img.image_url} target="_blank" rel="noopener noreferrer" className="block">
                          <img src={img.image_url} alt={img.description || "Attachment"} className="h-16 w-16 object-cover rounded border hover:opacity-80 transition-opacity" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingNote ? "Edit SOAP Note" : "Add SOAP Note"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1"><Label className="text-xs">Subjective (Complaints)</Label><Textarea value={form.subjective} onChange={e => setForm(f => ({ ...f, subjective: e.target.value }))} rows={2} placeholder="Patient complaints, symptoms..." /></div>
            <div className="space-y-1"><Label className="text-xs">Objective (Findings)</Label><Textarea value={form.objective} onChange={e => setForm(f => ({ ...f, objective: e.target.value }))} rows={2} placeholder="Clinical findings, exam results..." /></div>
            <div className="space-y-1"><Label className="text-xs">Assessment (Diagnosis)</Label><Textarea value={form.assessment} onChange={e => setForm(f => ({ ...f, assessment: e.target.value }))} rows={2} placeholder="Diagnosis, clinical impression..." /></div>
            <div className="space-y-1"><Label className="text-xs">Plan (Treatment Plan)</Label><Textarea value={form.plan} onChange={e => setForm(f => ({ ...f, plan: e.target.value }))} rows={2} placeholder="Treatment plan, follow-up..." /></div>
            
            {/* Attachments */}
            <div className="space-y-1">
              <Label className="text-xs flex items-center gap-1"><Paperclip className="h-3 w-3" /> Attach Images / Scans</Label>
              <Input type="file" accept="image/*" multiple onChange={e => {
                const files = Array.from(e.target.files || []);
                setAttachments(prev => [...prev, ...files]);
              }} />
              {attachments.length > 0 && (
                <div className="flex gap-2 flex-wrap mt-1">
                  {attachments.map((f, i) => (
                    <div key={i} className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded">
                      <ImageIcon className="h-3 w-3" />
                      <span className="truncate max-w-[100px]">{f.name}</span>
                      <button onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))} className="text-destructive ml-1">×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button className="bg-secondary hover:bg-secondary/90" disabled={isPending} onClick={handleSave}>
              {isPending ? "Saving..." : editingNote ? "Update Note" : "Save Note"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
