import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, ChevronRight } from "lucide-react";
import { useLabCases, useUpdateLabCase, type LabCaseRow } from "@/hooks/useLabCases";
import { CreateLabCaseDialog } from "@/components/dashboard/CreateLabCaseDialog";
import { EditLabCaseDialog } from "@/components/dashboard/EditLabCaseDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { motion } from "framer-motion";

const statusStyles: Record<string, string> = {
  pending: "bg-muted text-muted-foreground",
  "in-progress": "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  ready: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  delivered: "bg-muted text-muted-foreground",
};

const statusDots: Record<string, string> = {
  pending: "bg-muted-foreground/50",
  "in-progress": "bg-blue-500",
  ready: "bg-emerald-500",
  delivered: "bg-muted-foreground/50",
};

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "in-progress", label: "In Progress" },
  { value: "ready", label: "Ready" },
  { value: "delivered", label: "Delivered" },
];

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } },
  item: { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } },
};

export default function LabCasesPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [editCase, setEditCase] = useState<LabCaseRow | null>(null);
  const { data: cases = [], isLoading } = useLabCases();
  const updateLabCase = useUpdateLabCase();
  const statuses = ["pending", "in-progress", "ready", "delivered"] as const;

  const handleStatusChange = (caseItem: LabCaseRow, newStatus: string) => {
    const now = new Date().toISOString().split("T")[0];
    updateLabCase.mutate({
      id: caseItem.id,
      status: newStatus,
      ...(newStatus === "ready" && caseItem.status !== "ready" ? { completed_date: now } : {}),
      ...(newStatus === "delivered" && caseItem.status !== "delivered" ? { delivered_date: now } : {}),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Lab Cases</h1>
          <p className="text-sm text-muted-foreground">Manage and track all lab cases</p>
        </div>
        <Button size="sm" className="bg-secondary hover:bg-secondary/90" onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Lab Case
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground text-center py-10">Loading lab cases...</p>
      ) : (
        <motion.div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" variants={stagger.container} initial="hidden" animate="visible">
          {statuses.map((status) => {
            const filtered = cases.filter((c) => c.status === status);
            return (
              <motion.div key={status} variants={stagger.item}>
                <Card className="glass-card">
                  <CardHeader className="pb-2 border-b border-border/30">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm capitalize">{status.replace("-", " ")}</CardTitle>
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-medium ${statusStyles[status]}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${statusDots[status]}`} />
                        {filtered.length}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-3">
                    {filtered.map((c) => (
                      <div
                        key={c.id}
                        className={`p-3 rounded-lg border border-border/30 bg-card/50 hover:shadow-md transition-all duration-200 ${c.is_urgent ? "border-destructive/50" : ""}`}
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{c.work_type}</p>
                          <div className="flex items-center gap-1">
                            {c.is_urgent && <Badge variant="destructive" className="text-[10px] px-1.5">Urgent</Badge>}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => setEditCase(c)}
                              title="Edit case"
                            >
                              <Pencil className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {c.patients ? `${c.patients.first_name} ${c.patients.last_name}` : "Unknown"}
                        </p>
                        <p className="text-[10px] text-muted-foreground">{c.case_number}</p>
                        {c.clinic_doctor_name && (
                          <p className="text-[10px] text-muted-foreground">Clinic: {c.clinic_doctor_name}</p>
                        )}
                        {c.remark && (
                          <Badge variant="outline" className="text-[10px] mt-1">{c.remark}</Badge>
                        )}

                        {/* Status change dropdown */}
                        <div className="mt-2 pt-1.5 border-t border-border/20">
                          <Select
                            value={c.status}
                            onValueChange={(val) => handleStatusChange(c, val)}
                          >
                            <SelectTrigger className="h-7 text-[11px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {STATUS_OPTIONS.map((s) => (
                                <SelectItem key={s.value} value={s.value} className="text-xs">
                                  {s.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex justify-between items-center mt-2 pt-1.5 border-t border-border/20">
                          <span className="text-[10px] text-muted-foreground">
                            ₦{Number(c.lab_fee).toLocaleString()}
                            {Number(c.discount) > 0 && <span className="text-destructive ml-1">-₦{Number(c.discount).toLocaleString()}</span>}
                          </span>
                          {c.due_date && (
                            <span className={`text-[10px] ${
                              new Date(c.due_date) < new Date() && !["delivered", "ready"].includes(c.status)
                                ? "text-destructive font-medium"
                                : "text-muted-foreground"
                            }`}>
                              Due: {format(new Date(c.due_date), "MMM d")}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                    {filtered.length === 0 && (
                      <p className="text-xs text-muted-foreground text-center py-4">No cases</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      <CreateLabCaseDialog open={createOpen} onOpenChange={setCreateOpen} />
      <EditLabCaseDialog labCase={editCase} open={!!editCase} onOpenChange={(open) => { if (!open) setEditCase(null); }} />
    </div>
  );
}
