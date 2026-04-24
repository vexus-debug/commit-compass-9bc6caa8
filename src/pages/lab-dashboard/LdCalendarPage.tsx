import { useState, useMemo } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, AlertTriangle, Clock } from "lucide-react";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks, isToday, isSameDay, parseISO, isBefore } from "date-fns";
import { useLdCases, useLdStaff } from "@/hooks/useLabDashboard";
import { motion } from "framer-motion";

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-300",
  "in-progress": "bg-blue-100 text-blue-800 border-blue-300",
  completed: "bg-emerald-100 text-emerald-800 border-emerald-300",
  delivered: "bg-purple-100 text-purple-800 border-purple-300",
};

export default function LdCalendarPage() {
  const { data: cases = [] } = useLdCases();
  const { data: staff = [] } = useLdStaff();

  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedTechnician, setSelectedTechnician] = useState<string>("all");

  const technicians = staff.filter(s => s.role === "technician" && s.status === "active");

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const filteredCases = useMemo(() => {
    let filtered = cases.filter(c => c.due_date);
    if (selectedTechnician !== "all") {
      filtered = filtered.filter(c => c.assigned_technician_id === selectedTechnician);
    }
    return filtered;
  }, [cases, selectedTechnician]);

  const getCasesForDay = (day: Date) => {
    return filteredCases.filter(c => c.due_date && isSameDay(parseISO(c.due_date), day));
  };

  const overdueCases = cases.filter(c => 
    c.due_date && 
    isBefore(parseISO(c.due_date), new Date()) && 
    c.status !== "completed" && 
    c.status !== "delivered"
  );

  const dueTodayCases = cases.filter(c => 
    c.due_date && 
    isToday(parseISO(c.due_date)) && 
    c.status !== "completed" && 
    c.status !== "delivered"
  );

  const getTechnicianName = (id: string | null) => {
    if (!id) return "Unassigned";
    const tech = staff.find(s => s.id === id);
    return tech?.full_name || "Unknown";
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Work Calendar"
        description="Visual technician workload and case scheduling"
      />

      {/* Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className={overdueCases.length > 0 ? "border-destructive/50 bg-destructive/5" : ""}>
          <CardContent className="flex items-center gap-4 py-4">
            <div className={`p-3 rounded-full ${overdueCases.length > 0 ? "bg-destructive/20" : "bg-muted"}`}>
              <AlertTriangle className={`h-6 w-6 ${overdueCases.length > 0 ? "text-destructive" : "text-muted-foreground"}`} />
            </div>
            <div>
              <p className="text-2xl font-bold">{overdueCases.length}</p>
              <p className="text-sm text-muted-foreground">Overdue Cases</p>
            </div>
          </CardContent>
        </Card>
        <Card className={dueTodayCases.length > 0 ? "border-amber-500/50 bg-amber-50" : ""}>
          <CardContent className="flex items-center gap-4 py-4">
            <div className={`p-3 rounded-full ${dueTodayCases.length > 0 ? "bg-amber-200" : "bg-muted"}`}>
              <Clock className={`h-6 w-6 ${dueTodayCases.length > 0 ? "text-amber-700" : "text-muted-foreground"}`} />
            </div>
            <div>
              <p className="text-2xl font-bold">{dueTodayCases.length}</p>
              <p className="text-sm text-muted-foreground">Due Today</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Controls */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            Week of {format(weekStart, "MMM dd, yyyy")}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select value={selectedTechnician} onValueChange={setSelectedTechnician}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Technicians" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Technicians</SelectItem>
                {technicians.map(t => (
                  <SelectItem key={t.id} value={t.id}>{t.full_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentWeek(new Date())}>Today</Button>
            <Button variant="outline" size="icon" onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map(day => {
              const dayCases = getCasesForDay(day);
              const isCurrentDay = isToday(day);
              return (
                <div
                  key={day.toISOString()}
                  className={`min-h-[200px] border rounded-lg p-2 ${isCurrentDay ? "border-primary bg-primary/5" : "border-border"}`}
                >
                  <div className={`text-center pb-2 border-b mb-2 ${isCurrentDay ? "font-bold text-primary" : ""}`}>
                    <p className="text-xs text-muted-foreground">{format(day, "EEE")}</p>
                    <p className="text-lg">{format(day, "d")}</p>
                  </div>
                  <div className="space-y-1 max-h-[150px] overflow-y-auto">
                    {dayCases.map((c, idx) => (
                      <motion.div
                        key={c.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.02 }}
                        className={`text-xs p-1.5 rounded border ${statusColors[c.status] || "bg-muted"} cursor-pointer hover:shadow-sm transition-shadow`}
                        title={`${c.case_number} - ${c.patient_name}`}
                      >
                        <p className="font-medium truncate">{c.case_number}</p>
                        <p className="truncate text-[10px] opacity-80">{c.work_type_name}</p>
                        <p className="truncate text-[10px] opacity-60">{getTechnicianName(c.assigned_technician_id)}</p>
                      </motion.div>
                    ))}
                    {dayCases.length === 0 && (
                      <p className="text-xs text-muted-foreground text-center py-4">No cases</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Overdue List */}
      {overdueCases.length > 0 && (
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Overdue Cases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {overdueCases.map(c => (
                <div key={c.id} className="flex items-center justify-between p-3 bg-destructive/5 rounded-lg border border-destructive/20">
                  <div>
                    <p className="font-medium">{c.case_number}</p>
                    <p className="text-sm text-muted-foreground">{c.work_type_name} - {c.patient_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-destructive">
                      Due: {c.due_date ? format(parseISO(c.due_date), "MMM dd") : "-"}
                    </p>
                    <Badge variant="outline" className="mt-1">{c.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
