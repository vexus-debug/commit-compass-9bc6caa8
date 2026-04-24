import { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Plus, CalendarIcon } from "lucide-react";
import { useCreateClinicalNote } from "@/hooks/useClinicalNotes";

interface ComplaintsTabProps {
  patientId: string;
  clinicalNotes: any[];
  canEdit: boolean;
  userId?: string;
}

export function ComplaintsTab({ patientId, clinicalNotes, canEdit, userId }: ComplaintsTabProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [complaint, setComplaint] = useState("");
  const [complaintDate, setComplaintDate] = useState<Date>(new Date());
  const createNote = useCreateClinicalNote();

  // Show notes that have subjective (complaint) entries
  const complaints = clinicalNotes.filter((n: any) => n.subjective);

  const handleSave = () => {
    createNote.mutate(
      {
        patient_id: patientId,
        subjective: complaint,
        created_by: userId,
        // Store the selected date as part of the note via objective field as metadata
        objective: `complaint_date:${format(complaintDate, "yyyy-MM-dd")}`,
      },
      {
        onSuccess: () => {
          setDialogOpen(false);
          setComplaint("");
          setComplaintDate(new Date());
        },
      }
    );
  };

  // Extract complaint date from objective metadata if present
  const getComplaintDate = (note: any) => {
    if (note.objective?.startsWith("complaint_date:")) {
      return note.objective.replace("complaint_date:", "");
    }
    return new Date(note.created_at).toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Patient Complaints</h3>
        {canEdit && (
          <Button size="sm" variant="outline" onClick={() => setDialogOpen(true)}>
            <Plus className="mr-1 h-3 w-3" /> Add Complaint
          </Button>
        )}
      </div>

      {complaints.length === 0 ? (
        <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">No complaints recorded.</CardContent></Card>
      ) : (
        complaints.map((note: any) => (
          <Card key={note.id}>
            <CardContent className="py-4 space-y-1">
              <p className="text-xs text-muted-foreground">{getComplaintDate(note)}</p>
              <p className="text-sm">{note.subjective}</p>
            </CardContent>
          </Card>
        ))
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Record Patient Complaint</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs">Date of Complaint *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !complaintDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {complaintDate ? format(complaintDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={complaintDate}
                    onSelect={(d) => d && setComplaintDate(d)}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Complaint / Chief Concern *</Label>
              <Textarea value={complaint} onChange={(e) => setComplaint(e.target.value)} rows={4} placeholder="Describe the patient's complaint..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button className="bg-secondary hover:bg-secondary/90" disabled={createNote.isPending || !complaint.trim()} onClick={handleSave}>
              {createNote.isPending ? "Saving..." : "Save Complaint"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
