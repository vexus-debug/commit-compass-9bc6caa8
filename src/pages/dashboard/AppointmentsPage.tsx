import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CalendarPlus, ChevronLeft, ChevronRight, CalendarIcon, UserPlus, CalendarDays } from "lucide-react";
import { addDays, subDays, format, startOfWeek, addWeeks, subWeeks, isSameDay } from "date-fns";
import { BookAppointmentDialog } from "@/components/dashboard/BookAppointmentDialog";
import { AppointmentDetailDialog } from "@/components/dashboard/AppointmentDetailDialog";
import { WalkInDialog } from "@/components/dashboard/WalkInDialog";
import { cn } from "@/lib/utils";
import { useAppointmentsByDate, type AppointmentRow } from "@/hooks/useAppointments";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { TableSkeleton } from "@/components/dashboard/TableSkeleton";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { motion } from "framer-motion";

const chairs = ["Chair 1", "Chair 2", "Chair 3"];
const timeSlots = ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM"];

const statusColors: Record<string, string> = {
  scheduled: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  "in-progress": "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  completed: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  cancelled: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
};

const statusDots: Record<string, string> = {
  scheduled: "bg-blue-500",
  "in-progress": "bg-amber-500",
  completed: "bg-emerald-500",
  cancelled: "bg-red-500",
};

export default function AppointmentsPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookOpen, setBookOpen] = useState(false);
  const [walkInOpen, setWalkInOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"day" | "week">("day");
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentRow | null>(null);

  const { data: appointments = [], isLoading } = useAppointmentsByDate(currentDate);

  const displayAppointments = appointments.map((a) => ({
    ...a,
    patientName: a.patients ? `${a.patients.first_name} ${a.patients.last_name}` : "Unknown",
    dentist: a.staff?.full_name || "Unknown",
    time: a.appointment_time,
    treatment: a.treatments?.name || "N/A",
  }));

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="space-y-6">
      <PageHeader title="Appointments" description="Manage and schedule patient visits">
        <Button size="sm" variant="outline" onClick={() => setWalkInOpen(true)} className="border-border/50">
          <UserPlus className="mr-2 h-4 w-4" />
          Walk-In
        </Button>
        <Button size="sm" className="bg-secondary hover:bg-secondary/90 shadow-lg shadow-secondary/20" onClick={() => setBookOpen(true)}>
          <CalendarPlus className="mr-2 h-4 w-4" />
          Book Appointment
        </Button>
      </PageHeader>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Tabs defaultValue="schedule">
          <TabsList className="bg-muted/50 backdrop-blur-sm">
            <TabsTrigger value="schedule">Schedule View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="mt-4">
            <Card className="glass-card overflow-hidden">
              <CardHeader className="pb-3 border-b border-border/30">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setCurrentDate(viewMode === "day" ? subDays(currentDate, 1) : subWeeks(currentDate, 1))}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <CardTitle className="text-base">
                      {viewMode === "day"
                        ? format(currentDate, "EEEE, MMMM d, yyyy")
                        : `${format(weekStart, "MMM d")} — ${format(addDays(weekStart, 6), "MMM d, yyyy")}`}
                    </CardTitle>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setCurrentDate(viewMode === "day" ? addDays(currentDate, 1) : addWeeks(currentDate, 1))}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs border-border/50" onClick={() => setCurrentDate(new Date())}>Today</Button>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="text-xs border-border/50">
                          <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
                          Jump to date
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 backdrop-blur-xl" align="start">
                        <Calendar mode="single" selected={currentDate} onSelect={(d) => d && setCurrentDate(d)} initialFocus className="p-3 pointer-events-auto" />
                      </PopoverContent>
                    </Popover>
                    <div className="flex border border-border/50 rounded-lg overflow-hidden">
                      <button className={cn("px-3 py-1.5 text-xs font-medium transition-all", viewMode === "day" ? "bg-secondary text-secondary-foreground" : "bg-muted/30 hover:bg-muted/60")} onClick={() => setViewMode("day")}>Day</button>
                      <button className={cn("px-3 py-1.5 text-xs font-medium transition-all", viewMode === "week" ? "bg-secondary text-secondary-foreground" : "bg-muted/30 hover:bg-muted/60")} onClick={() => setViewMode("week")}>Week</button>
                    </div>
                  </div>
                  <div className="flex gap-2.5 hidden md:flex">
                    {Object.entries(statusColors).map(([status]) => (
                      <div key={status} className="flex items-center gap-1.5">
                        <span className={`h-2 w-2 rounded-full ${statusDots[status]}`} />
                        <span className="text-[10px] text-muted-foreground capitalize">{status.replace("-", " ")}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                {isLoading ? (
                  <TableSkeleton columns={4} rows={8} />
                ) : viewMode === "day" ? (
                  displayAppointments.length === 0 ? (
                    <EmptyState
                      icon={CalendarDays}
                      title="No appointments"
                      description="No appointments scheduled for this day. Book one to get started."
                      actionLabel="Book Appointment"
                      onAction={() => setBookOpen(true)}
                    />
                  ) : (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/20">
                          <th className="py-3 px-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider w-24">Time</th>
                          {chairs.map((chair) => (
                            <th key={chair} className="py-3 px-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider">{chair}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {timeSlots.map((time) => {
                          const appointmentsAtTime = displayAppointments.filter((a) => a.time === time);
                          return (
                            <tr key={time} className="border-b border-border/20 hover:bg-accent/20 transition-colors">
                              <td className="py-2 px-3 text-xs text-muted-foreground font-mono">{time}</td>
                              {chairs.map((chair) => {
                                const apt = appointmentsAtTime.find((a) => a.chair === chair);
                                return (
                                  <td key={chair} className="py-1 px-2">
                                    {apt ? (
                                      <div
                                        className={`rounded-lg border p-2.5 text-xs cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02] ${statusColors[apt.status] || ""}`}
                                        onClick={() => setSelectedAppointment(apt)}
                                      >
                                        <div className="flex items-center gap-2 mb-1">
                                          <Avatar className="h-5 w-5">
                                            <AvatarFallback className="text-[8px] bg-current/10">{apt.patientName.split(" ").map((n: string) => n[0]).join("")}</AvatarFallback>
                                          </Avatar>
                                          <p className="font-medium truncate">{apt.patientName}</p>
                                        </div>
                                        <p className="opacity-75 truncate">{apt.treatment}</p>
                                        <p className="opacity-60 text-[10px] mt-0.5">{apt.dentist}</p>
                                      </div>
                                    ) : null}
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )
                ) : (
                  <div className="p-6 text-sm text-muted-foreground text-center">
                    <p className="mb-4">Select a day to view appointments</p>
                    <div className="grid grid-cols-7 gap-2">
                      {weekDays.map((day) => {
                        const isToday = isSameDay(day, new Date());
                        return (
                          <button
                            key={day.toISOString()}
                            className={cn("p-4 rounded-xl border border-border/40 text-center hover:bg-accent/40 cursor-pointer transition-all duration-200 hover:shadow-md", isToday && "bg-secondary/10 border-secondary/30 shadow-sm")}
                            onClick={() => { setCurrentDate(day); setViewMode("day"); }}
                          >
                            <div className="text-[10px] uppercase text-muted-foreground font-medium">{format(day, "EEE")}</div>
                            <div className="text-lg font-semibold mt-0.5">{format(day, "d")}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="list" className="mt-4">
            <Card className="glass-card overflow-hidden">
              <CardContent className="p-0">
                {isLoading ? (
                  <TableSkeleton columns={6} rows={6} />
                ) : displayAppointments.length === 0 ? (
                  <EmptyState icon={CalendarDays} title="No appointments" description="No appointments scheduled for this day." />
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/20">
                        <th className="py-3 px-4 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider">Time</th>
                        <th className="py-3 px-4 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider">Patient</th>
                        <th className="py-3 px-4 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider hidden md:table-cell">Dentist</th>
                        <th className="py-3 px-4 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider hidden md:table-cell">Chair</th>
                        <th className="py-3 px-4 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider">Treatment</th>
                        <th className="py-3 px-4 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayAppointments.map((apt, i) => {
                        const initials = apt.patientName.split(" ").map((n: string) => n[0]).join("").slice(0, 2);
                        return (
                          <motion.tr
                            key={apt.id}
                            className="border-b border-border/30 last:border-0 hover:bg-accent/30 cursor-pointer transition-all group"
                            onClick={() => setSelectedAppointment(apt)}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.02 }}
                          >
                            <td className="py-3 px-4 font-mono text-xs">{apt.time}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2.5">
                                <Avatar className="h-7 w-7">
                                  <AvatarFallback className="bg-secondary/10 text-secondary text-[10px] font-semibold">{initials}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium group-hover:text-secondary transition-colors">{apt.patientName}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 hidden md:table-cell text-muted-foreground">{apt.dentist}</td>
                            <td className="py-3 px-4 hidden md:table-cell text-muted-foreground">{apt.chair}</td>
                            <td className="py-3 px-4 text-muted-foreground">{apt.treatment}</td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${(statusColors[apt.status] || "").replace(/border-\S+/g, "")}`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${statusDots[apt.status] || ""}`} />
                                {apt.status.replace("-", " ")}
                              </span>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      <BookAppointmentDialog open={bookOpen} onOpenChange={setBookOpen} />
      <WalkInDialog open={walkInOpen} onOpenChange={setWalkInOpen} />
      <AppointmentDetailDialog appointment={selectedAppointment} open={!!selectedAppointment} onOpenChange={(o) => !o && setSelectedAppointment(null)} />
    </div>
  );
}