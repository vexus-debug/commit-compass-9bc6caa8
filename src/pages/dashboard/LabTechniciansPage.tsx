import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { useLabCases } from "@/hooks/useLabCases";
import { useStaff } from "@/hooks/useStaff";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } },
  item: { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } },
};

export default function LabTechniciansPage() {
  const { data: cases = [], isLoading: casesLoading } = useLabCases();
  const { data: staffList = [], isLoading: staffLoading } = useStaff();

  const isLoading = casesLoading || staffLoading;

  const technicianIds = new Set(
    cases
      .filter((c) => c.assigned_technician_id)
      .map((c) => c.assigned_technician_id!)
  );

  const technicians = staffList.filter(
    (s) => s.role === "lab_technician" || technicianIds.has(s.id)
  );

  const getWorkload = (techId: string) => {
    const assigned = cases.filter(
      (c) =>
        c.assigned_technician_id === techId &&
        !["delivered"].includes(c.status)
    );
    return {
      total: assigned.length,
      pending: assigned.filter((c) => c.status === "pending").length,
      inProgress: assigned.filter((c) => c.status === "in-progress").length,
      ready: assigned.filter((c) => c.status === "ready").length,
      urgent: assigned.filter((c) => c.is_urgent).length,
    };
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Lab Technicians" description="View technician workload and assignments" />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="glass-card"><CardContent className="p-5 space-y-3"><Skeleton className="h-4 w-32" /><div className="grid grid-cols-2 gap-2">{Array.from({ length: 4 }).map((_, j) => <Skeleton key={j} className="h-16 rounded-lg" />)}</div></CardContent></Card>
          ))}
        </div>
      ) : technicians.length === 0 ? (
        <EmptyState icon={Users} title="No lab technicians" description='Add staff with the "lab_technician" role to see them here.' />
      ) : (
        <motion.div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" variants={stagger.container} initial="hidden" animate="visible">
          {technicians.map((tech) => {
            const workload = getWorkload(tech.id);
            const initials = tech.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2);
            return (
              <motion.div key={tech.id} variants={stagger.item}>
                <Card className="glass-card hover:shadow-lg hover:shadow-secondary/5 transition-all duration-300 group hover:border-secondary/20">
                  <CardHeader className="pb-2 border-b border-border/30">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 ring-2 ring-border/30">
                        <AvatarFallback className="bg-secondary/10 text-secondary text-xs font-semibold">{initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-sm group-hover:text-secondary transition-colors">{tech.full_name}</CardTitle>
                        {tech.specialty && <p className="text-xs text-muted-foreground">{tech.specialty}</p>}
                      </div>
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-medium ${tech.status === "active" ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "bg-muted text-muted-foreground"}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${tech.status === "active" ? "bg-emerald-500" : "bg-muted-foreground/50"}`} />
                        {tech.status}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-3">
                    <div className="grid grid-cols-2 gap-2 text-center">
                      {[
                        { label: "Active", value: workload.total, color: "text-foreground" },
                        { label: "In Progress", value: workload.inProgress, color: "text-blue-600 dark:text-blue-400" },
                        { label: "Pending", value: workload.pending, color: "text-amber-600 dark:text-amber-400" },
                        { label: "Urgent", value: workload.urgent, color: "text-destructive" },
                      ].map((stat) => (
                        <div key={stat.label} className="p-2.5 rounded-lg bg-muted/30 border border-border/20">
                          <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                          <p className="text-[10px] text-muted-foreground font-medium">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}