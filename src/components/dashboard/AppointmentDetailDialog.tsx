import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useUpdateAppointment, type AppointmentRow } from "@/hooks/useAppointments";
import { useDentists } from "@/hooks/useStaff";

const statusOptions = ["scheduled", "in-progress", "completed", "cancelled"];
const chairs = ["Chair 1", "Chair 2", "Chair 3"];

interface AppointmentDetailDialogProps {
  appointment: AppointmentRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AppointmentDetailDialog({ appointment, open, onOpenChange }: AppointmentDetailDialogProps) {
  const updateAppointment = useUpdateAppointment();
  const { data: dentists = [] } = useDentists();
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState("");
  const [chair, setChair] = useState("");
  const [staffId, setStaffId] = useState("");
  const [notes, setNotes] = useState("");
  const [time, setTime] = useState("");

  const startEdit = () => {
    if (!appointment) return;
    setStatus(appointment.status);
    setChair(appointment.chair || "");
    setStaffId(appointment.staff_id);
    setNotes(appointment.notes || "");
    setTime(appointment.appointment_time);
    setEditing(true);
  };

  const handleSave = async () => {
    if (!appointment) return;
    await updateAppointment.mutateAsync({
      id: appointment.id,
      status,
      chair,
      staff_id: staffId,
      notes,
      appointment_time: time,
    });
    setEditing(false);
    onOpenChange(false);
  };

  const handleQuickStatus = async (newStatus: string) => {
    if (!appointment) return;
    await updateAppointment.mutateAsync({ id: appointment.id, status: newStatus });
    onOpenChange(false);
  };

  if (!appointment) return null;

  const statusColors: Record<string, string> = {
    scheduled: "bg-blue-100 text-blue-700",
    "in-progress": "bg-amber-100 text-amber-700",
    completed: "bg-emerald-100 text-emerald-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) setEditing(false); onOpenChange(o); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Appointment Details
            <Badge className={statusColors[appointment.status] || ""}>{appointment.status.replace("-", " ")}</Badge>
          </DialogTitle>
        </DialogHeader>

        {editing ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Time</Label>
                <Input value={time} onChange={(e) => setTime(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Chair</Label>
                <Select value={chair} onValueChange={setChair}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {chairs.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Dentist</Label>
                <Select value={staffId} onValueChange={setStaffId}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {dentists.map((d) => <SelectItem key={d.id} value={d.id}>{d.full_name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace("-", " ")}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Notes</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
            </div>
          </div>
        ) : (
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Patient</span><span className="font-medium">{appointment.patients ? `${appointment.patients.first_name} ${appointment.patients.last_name}` : "Unknown"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Dentist</span><span>{appointment.staff?.full_name || "Unknown"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Treatment</span><span>{appointment.treatments?.name || "N/A"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span>{appointment.appointment_date}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Time</span><span>{appointment.appointment_time}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Chair</span><span>{appointment.chair || "N/A"}</span></div>
            {appointment.notes && <div><span className="text-muted-foreground">Notes: </span>{appointment.notes}</div>}
            {appointment.is_walk_in && <Badge variant="outline" className="text-[10px]">Walk-in</Badge>}
          </div>
        )}

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {editing ? (
            <>
              <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
              <Button onClick={handleSave} className="bg-secondary hover:bg-secondary/90" disabled={updateAppointment.isPending}>
                {updateAppointment.isPending ? "Saving..." : "Save"}
              </Button>
            </>
          ) : (
            <>
              {appointment.status === "scheduled" && (
                <>
                  <Button variant="outline" size="sm" onClick={() => handleQuickStatus("cancelled")} className="text-red-600 hover:text-red-700">
                    Cancel Appointment
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleQuickStatus("in-progress")}>
                    Start
                  </Button>
                </>
              )}
              {appointment.status === "in-progress" && (
                <Button variant="outline" size="sm" onClick={() => handleQuickStatus("completed")} className="text-emerald-600 hover:text-emerald-700">
                  Mark Complete
                </Button>
              )}
              <Button onClick={startEdit} className="bg-secondary hover:bg-secondary/90" size="sm">Edit</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
