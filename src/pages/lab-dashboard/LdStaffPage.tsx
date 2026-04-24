import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLdStaff, useCreateLdStaff, useUpdateLdStaff, useLdCases } from "@/hooks/useLabDashboard";
import { motion } from "framer-motion";

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } },
  item: { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } },
};

export default function LdStaffPage() {
  const { data: staff = [], isLoading } = useLdStaff();
  const { data: cases = [] } = useLdCases();
  const createStaff = useCreateLdStaff();
  const updateStaff = useUpdateLdStaff();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editStaff, setEditStaff] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const values = {
      full_name: fd.get("full_name") as string,
      role: fd.get("role") as string,
      specialty: fd.get("specialty") as string,
      phone: fd.get("phone") as string,
      email: fd.get("email") as string,
      status: fd.get("status") as string,
      seniority_level: Number(fd.get("seniority_level") || 1),
    };
    if (editStaff) {
      updateStaff.mutate({ id: editStaff.id, ...values }, { onSuccess: () => { setDialogOpen(false); setEditStaff(null); } });
    } else {
      createStaff.mutate(values, { onSuccess: () => setDialogOpen(false) });
    }
  };

  const getWorkload = (staffId: string) => {
    const assigned = cases.filter((c: any) => c.assigned_technician_id === staffId && !["delivered"].includes(c.status));
    return {
      total: assigned.length,
      pending: assigned.filter((c: any) => c.status === "pending").length,
      inProgress: assigned.filter((c: any) => c.status === "in-progress").length,
      ready: assigned.filter((c: any) => c.status === "ready").length,
      urgent: assigned.filter((c: any) => c.is_urgent).length,
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Lab Staff</h1>
          <p className="text-sm text-muted-foreground">Manage technicians and lab personnel</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-border/50 overflow-hidden">
            <button onClick={() => setViewMode("cards")} className={`px-3 py-1.5 text-xs font-medium transition-colors ${viewMode === "cards" ? "bg-secondary text-secondary-foreground" : "bg-background text-muted-foreground hover:text-foreground"}`}>Cards</button>
            <button onClick={() => setViewMode("table")} className={`px-3 py-1.5 text-xs font-medium transition-colors ${viewMode === "table" ? "bg-secondary text-secondary-foreground" : "bg-background text-muted-foreground hover:text-foreground"}`}>Table</button>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) setEditStaff(null); }}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-1" /> Add Staff</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editStaff ? "Edit Staff" : "Add Staff"}</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2"><Label>Full Name *</Label><Input name="full_name" required defaultValue={editStaff?.full_name || ""} /></div>
                  <div>
                    <Label>Role</Label>
                    <select name="role" className="w-full border rounded-md p-2 text-sm bg-background" defaultValue={editStaff?.role || "technician"}>
                      <option value="technician">Technician</option>
                      <option value="senior_technician">Senior Technician</option>
                      <option value="manager">Manager</option>
                      <option value="assistant">Assistant</option>
                    </select>
                  </div>
                  <div><Label>Specialty</Label><Input name="specialty" defaultValue={editStaff?.specialty || ""} /></div>
                  <div><Label>Phone</Label><Input name="phone" defaultValue={editStaff?.phone || ""} /></div>
                  <div><Label>Email</Label><Input name="email" defaultValue={editStaff?.email || ""} /></div>
                  <div><Label>Seniority Level</Label><Input name="seniority_level" type="number" min={1} max={10} defaultValue={editStaff?.seniority_level || 1} /></div>
                  <div>
                    <Label>Status</Label>
                    <select name="status" className="w-full border rounded-md p-2 text-sm bg-background" defaultValue={editStaff?.status || "active"}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <Button type="submit" className="w-full">{editStaff ? "Update" : "Add Staff"}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground text-center py-10">Loading...</p>
      ) : viewMode === "cards" ? (
        <motion.div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" variants={stagger.container} initial="hidden" animate="visible">
          {staff.map((s: any) => {
            const workload = getWorkload(s.id);
            const initials = s.full_name.split(" ").map((n: string) => n[0]).join("").slice(0, 2);
            return (
              <motion.div key={s.id} variants={stagger.item}>
                <Card className="border-border/50 hover:shadow-lg hover:shadow-secondary/5 transition-all duration-300 group hover:border-secondary/20">
                  <CardHeader className="pb-2 border-b border-border/30">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 ring-2 ring-border/30">
                        <AvatarFallback className="bg-secondary/10 text-secondary text-xs font-semibold">{initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-sm group-hover:text-secondary transition-colors">{s.full_name}</CardTitle>
                        <p className="text-xs text-muted-foreground capitalize">{s.role.replace("_", " ")}{s.specialty ? ` • ${s.specialty}` : ""}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-medium ${s.status === "active" ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "bg-muted text-muted-foreground"}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${s.status === "active" ? "bg-emerald-500" : "bg-muted-foreground/50"}`} />
                          {s.status}
                        </span>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditStaff(s); setDialogOpen(true); }}>
                          <Pencil className="h-3 w-3" />
                        </Button>
                      </div>
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
          {staff.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-10 col-span-full">No staff found. Add your first team member.</p>
          )}
        </motion.div>
      ) : (
        <Card className="border-border/50">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/30">
                    <th className="text-left p-3 font-medium text-muted-foreground">Name</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Role</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Specialty</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Phone</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                    <th className="text-right p-3 font-medium text-muted-foreground">Active Cases</th>
                    <th className="text-right p-3 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {!staff.length ? (
                    <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No staff found</td></tr>
                  ) : staff.map((s: any) => {
                    const workload = getWorkload(s.id);
                    return (
                      <tr key={s.id} className="border-b border-border/30 hover:bg-muted/20">
                        <td className="p-3 font-medium">{s.full_name}</td>
                        <td className="p-3 capitalize">{s.role.replace("_", " ")}</td>
                        <td className="p-3 text-xs">{s.specialty || "—"}</td>
                        <td className="p-3 text-xs">{s.phone || "—"}</td>
                        <td className="p-3"><Badge variant={s.status === "active" ? "default" : "secondary"}>{s.status}</Badge></td>
                        <td className="p-3 text-right">
                          <span className="font-medium">{workload.total}</span>
                          {workload.urgent > 0 && <Badge variant="destructive" className="ml-1 text-[10px]">{workload.urgent} urgent</Badge>}
                        </td>
                        <td className="p-3 text-right">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditStaff(s); setDialogOpen(true); }}><Pencil className="h-3.5 w-3.5" /></Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
