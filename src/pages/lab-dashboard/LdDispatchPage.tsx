import { useState, useMemo } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Truck, Calendar as CalendarIcon, Clock, CheckCircle, MapPin, Phone, Package } from "lucide-react";
import { toast } from "sonner";
import { format, isToday, isTomorrow, parseISO } from "date-fns";
import { useLdPickupSchedules, useAddLdPickupSchedule, useUpdateLdPickupSchedule, useDeleteLdPickupSchedule } from "@/hooks/useLdExtendedFeatures";
import { useLdClients } from "@/hooks/useLabDashboard";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-800",
  "in-progress": "bg-amber-100 text-amber-800",
  completed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-destructive/20 text-destructive",
};

export default function LdDispatchPage() {
  const { data: schedules = [], isLoading } = useLdPickupSchedules();
  const { data: clients = [] } = useLdClients();
  const addSchedule = useAddLdPickupSchedule();
  const updateSchedule = useUpdateLdPickupSchedule();
  const deleteSchedule = useDeleteLdPickupSchedule();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const [formClientId, setFormClientId] = useState("");
  const [formPickupDate, setFormPickupDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [formPickupTime, setFormPickupTime] = useState("09:00");
  const [formPickupType, setFormPickupType] = useState("pickup");
  const [formDriverName, setFormDriverName] = useState("");
  const [formDriverPhone, setFormDriverPhone] = useState("");
  const [formEstimatedCases, setFormEstimatedCases] = useState(0);
  const [formNotes, setFormNotes] = useState("");

  // Today's and tomorrow's schedules
  const todaySchedules = schedules.filter(s => isToday(parseISO(s.pickup_date)));
  const tomorrowSchedules = schedules.filter(s => isTomorrow(parseISO(s.pickup_date)));

  // Schedules for selected date
  const selectedDateSchedules = useMemo(() => {
    if (!selectedDate) return [];
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    return schedules.filter(s => s.pickup_date === dateStr);
  }, [schedules, selectedDate]);

  const resetForm = () => {
    setFormClientId("");
    setFormPickupDate(format(new Date(), "yyyy-MM-dd"));
    setFormPickupTime("09:00");
    setFormPickupType("pickup");
    setFormDriverName("");
    setFormDriverPhone("");
    setFormEstimatedCases(0);
    setFormNotes("");
  };

  const handleCreate = async () => {
    if (!formClientId) {
      toast.error("Client is required");
      return;
    }
    try {
      await addSchedule.mutateAsync({
        client_id: formClientId,
        pickup_date: formPickupDate,
        pickup_time: formPickupTime,
        pickup_type: formPickupType,
        driver_name: formDriverName,
        driver_phone: formDriverPhone,
        estimated_cases: formEstimatedCases,
        notes: formNotes,
        status: "scheduled",
      } as any);
      toast.success("Pickup scheduled");
      setDialogOpen(false);
      resetForm();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const markInProgress = async (id: string) => {
    try {
      await updateSchedule.mutateAsync({ id, status: "in-progress" });
      toast.success("Marked in progress");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const markCompleted = async (id: string) => {
    try {
      await updateSchedule.mutateAsync({ id, status: "completed", completed_at: new Date().toISOString() });
      toast.success("Marked completed");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const cancelSchedule = async (id: string) => {
    if (!confirm("Cancel this pickup?")) return;
    try {
      await updateSchedule.mutateAsync({ id, status: "cancelled" });
      toast.success("Cancelled");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const getClientName = (id: string | null) => clients.find(c => c.id === id)?.clinic_name || "Unknown";
  const getClientAddress = (id: string | null) => clients.find(c => c.id === id)?.address || "";

  const renderScheduleCard = (schedule: any, idx: number) => {
    const clientAddress = getClientAddress(schedule.client_id);
    return (
      <motion.div
        key={schedule.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: idx * 0.05 }}
        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={statusColors[schedule.status] || "bg-muted"}>{schedule.status}</Badge>
              <Badge variant="outline" className="capitalize">{schedule.pickup_type}</Badge>
              {schedule.pickup_time && (
                <span className="text-sm font-medium flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {schedule.pickup_time}
                </span>
              )}
            </div>
            <p className="font-semibold text-lg">{getClientName(schedule.client_id)}</p>
            {clientAddress && (
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="h-3 w-3" />
                {clientAddress}
              </p>
            )}
            {schedule.driver_name && (
              <p className="text-sm mt-2 flex items-center gap-2">
                <Truck className="h-4 w-4 text-muted-foreground" />
                {schedule.driver_name}
                {schedule.driver_phone && (
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {schedule.driver_phone}
                  </span>
                )}
              </p>
            )}
            {schedule.estimated_cases > 0 && (
              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                <Package className="h-3 w-3" />
                ~{schedule.estimated_cases} cases
              </p>
            )}
            {schedule.notes && (
              <p className="text-sm text-muted-foreground mt-2 italic">"{schedule.notes}"</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            {schedule.status === "scheduled" && (
              <>
                <Button size="sm" variant="outline" onClick={() => markInProgress(schedule.id)}>
                  Start
                </Button>
                <Button size="sm" variant="ghost" className="text-destructive" onClick={() => cancelSchedule(schedule.id)}>
                  Cancel
                </Button>
              </>
            )}
            {schedule.status === "in-progress" && (
              <Button size="sm" onClick={() => markCompleted(schedule.id)} className="gap-1">
                <CheckCircle className="h-4 w-4" /> Complete
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dispatch & Pickups"
        description="Schedule and manage courier pickups and deliveries"
      >
        <Button onClick={() => { resetForm(); setDialogOpen(true); }} className="gap-2">
          <Plus className="h-4 w-4" /> Schedule Pickup
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Today & Tomorrow */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-primary" />
                Today ({format(new Date(), "MMM dd")})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {todaySchedules.length === 0 ? (
                <p className="text-muted-foreground">No pickups scheduled for today.</p>
              ) : (
                <div className="space-y-3">
                  {todaySchedules.map((s, idx) => renderScheduleCard(s, idx))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tomorrow */}
          <Card>
            <CardHeader>
              <CardTitle>Tomorrow</CardTitle>
            </CardHeader>
            <CardContent>
              {tomorrowSchedules.length === 0 ? (
                <p className="text-muted-foreground">No pickups scheduled for tomorrow.</p>
              ) : (
                <div className="space-y-3">
                  {tomorrowSchedules.map((s, idx) => renderScheduleCard(s, idx))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Calendar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          {selectedDate && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">
                  {format(selectedDate, "EEEE, MMMM dd")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDateSchedules.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No pickups on this date.</p>
                ) : (
                  <div className="space-y-2">
                    {selectedDateSchedules.map(s => (
                      <div key={s.id} className="text-sm p-2 border rounded">
                        <p className="font-medium">{getClientName(s.client_id)}</p>
                        <p className="text-muted-foreground">
                          {s.pickup_time} - {s.pickup_type}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Pickup</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Client *</Label>
              <Select value={formClientId} onValueChange={setFormClientId}>
                <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
                <SelectContent>
                  {clients.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.clinic_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" value={formPickupDate} onChange={e => setFormPickupDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Time</Label>
                <Input type="time" value={formPickupTime} onChange={e => setFormPickupTime(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={formPickupType} onValueChange={setFormPickupType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pickup">Pickup (from clinic)</SelectItem>
                  <SelectItem value="delivery">Delivery (to clinic)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Driver Name</Label>
                <Input value={formDriverName} onChange={e => setFormDriverName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Driver Phone</Label>
                <Input value={formDriverPhone} onChange={e => setFormDriverPhone(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Estimated Cases</Label>
              <Input type="number" value={formEstimatedCases} onChange={e => setFormEstimatedCases(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea value={formNotes} onChange={e => setFormNotes(e.target.value)} rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={addSchedule.isPending}>
              Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
