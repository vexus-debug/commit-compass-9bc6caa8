import { useState, useMemo } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Award, Users, Star, CheckCircle, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useLdTechnicianSkills, useAddLdTechnicianSkill, useUpdateLdTechnicianSkill, useDeleteLdTechnicianSkill } from "@/hooks/useLdExtendedFeatures";
import { useLdStaff, useLdWorkTypes } from "@/hooks/useLabDashboard";
import { motion } from "framer-motion";

const proficiencyLevels = [
  { value: "beginner", label: "Beginner", color: "bg-blue-100 text-blue-800", desc: "Learning / needs supervision" },
  { value: "intermediate", label: "Intermediate", color: "bg-amber-100 text-amber-800", desc: "Can work independently" },
  { value: "expert", label: "Expert", color: "bg-emerald-100 text-emerald-800", desc: "Master level / can train others" },
];

export default function LdSkillsMatrixPage() {
  const { data: skills = [], isLoading } = useLdTechnicianSkills();
  const { data: staff = [] } = useLdStaff();
  const { data: workTypes = [] } = useLdWorkTypes();
  const addSkill = useAddLdTechnicianSkill();
  const updateSkill = useUpdateLdTechnicianSkill();
  const deleteSkill = useDeleteLdTechnicianSkill();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"list" | "matrix">("matrix");

  const [formTechnicianId, setFormTechnicianId] = useState("");
  const [formWorkTypeId, setFormWorkTypeId] = useState("");
  const [formProficiency, setFormProficiency] = useState("intermediate");
  const [formCertified, setFormCertified] = useState(false);
  const [formCertDate, setFormCertDate] = useState("");
  const [formNotes, setFormNotes] = useState("");

  const technicians = staff.filter(s => s.status === "active");
  const activeWorkTypes = workTypes.filter(w => w.is_active);

  const matrixData = useMemo(() => {
    return technicians.map(tech => {
      const techSkills: Record<string, { proficiency: string; certified: boolean }> = {};
      skills.filter(s => s.technician_id === tech.id).forEach(s => {
        if (s.work_type_id) {
          techSkills[s.work_type_id] = { proficiency: s.proficiency_level, certified: s.certified || false };
        }
      });
      return { technician: tech, skills: techSkills };
    });
  }, [technicians, skills]);

  const resetForm = () => {
    setFormTechnicianId(""); setFormWorkTypeId(""); setFormProficiency("intermediate");
    setFormCertified(false); setFormCertDate(""); setFormNotes(""); setEditingSkill(null);
  };

  const openCreateDialog = () => { resetForm(); setDialogOpen(true); };

  const openEditDialog = (skill: any) => {
    setEditingSkill(skill); setFormTechnicianId(skill.technician_id || "");
    setFormWorkTypeId(skill.work_type_id || ""); setFormProficiency(skill.proficiency_level);
    setFormCertified(skill.certified || false); setFormCertDate(skill.certification_date || "");
    setFormNotes(skill.notes || ""); setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formTechnicianId || !formWorkTypeId) { toast.error("Technician and work type are required"); return; }
    const payload = {
      technician_id: formTechnicianId, work_type_id: formWorkTypeId,
      proficiency_level: formProficiency, certified: formCertified,
      certification_date: formCertDate || null, notes: formNotes,
    };
    try {
      if (editingSkill) { await updateSkill.mutateAsync({ id: editingSkill.id, ...payload }); toast.success("Skill updated"); }
      else { await addSkill.mutateAsync(payload as any); toast.success("Skill added"); }
      setDialogOpen(false); resetForm();
    } catch (err: any) { toast.error(err.message); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this skill assignment?")) return;
    try { await deleteSkill.mutateAsync(id); toast.success("Deleted"); }
    catch (err: any) { toast.error(err.message); }
  };

  const getTechName = (id: string | null) => staff.find(s => s.id === id)?.full_name || "Unknown";
  const getWorkTypeName = (id: string | null) => workTypes.find(w => w.id === id)?.name || "Unknown";
  const getProficiencyBadge = (level: string) => {
    const p = proficiencyLevels.find(pl => pl.value === level);
    return <Badge className={p?.color || "bg-muted"}>{p?.label || level}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Skills Matrix" description="Match technicians to work types by proficiency level">
        <Button variant={viewMode === "matrix" ? "default" : "outline"} size="sm" onClick={() => setViewMode("matrix")}>Matrix View</Button>
        <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>List View</Button>
        <Button onClick={openCreateDialog} className="gap-2"><Plus className="h-4 w-4" /> Add Skill</Button>
      </PageHeader>

      {/* Explanation Card */}
      <Card className="border-blue-500/20 bg-blue-500/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <HelpCircle className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <strong>What is the Skills Matrix?</strong>
              <p className="mt-1">This helps you track which technicians are skilled in which work types. When assigning jobs, you can check here to assign the right person. Each technician can be rated as:</p>
              <ul className="mt-2 space-y-1 ml-4 list-disc">
                <li><strong>Beginner</strong> — Learning, needs supervision</li>
                <li><strong>Intermediate</strong> — Can work independently on this type</li>
                <li><strong>Expert</strong> — Master level, can train others</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardContent className="flex items-center gap-4 py-4">
          <div className="p-3 rounded-full bg-primary/10"><Users className="h-6 w-6 text-primary" /></div>
          <div><p className="text-2xl font-bold">{technicians.length}</p><p className="text-sm text-muted-foreground">Active Technicians</p></div>
        </CardContent></Card>
        <Card><CardContent className="flex items-center gap-4 py-4">
          <div className="p-3 rounded-full bg-emerald-100"><Star className="h-6 w-6 text-emerald-600" /></div>
          <div><p className="text-2xl font-bold">{skills.filter(s => s.proficiency_level === "expert").length}</p><p className="text-sm text-muted-foreground">Expert Skills</p></div>
        </CardContent></Card>
        <Card><CardContent className="flex items-center gap-4 py-4">
          <div className="p-3 rounded-full bg-amber-100"><Award className="h-6 w-6 text-amber-600" /></div>
          <div><p className="text-2xl font-bold">{skills.filter(s => s.certified).length}</p><p className="text-sm text-muted-foreground">Certifications</p></div>
        </CardContent></Card>
      </div>

      {viewMode === "matrix" ? (
        <Card>
          <CardHeader><CardTitle>Skills Matrix</CardTitle></CardHeader>
          <CardContent className="overflow-x-auto">
            {technicians.length === 0 || activeWorkTypes.length === 0 ? (
              <p className="text-muted-foreground">Add technicians and work types to see the matrix.</p>
            ) : (
              <table className="w-full border-collapse">
                <thead><tr>
                  <th className="border p-2 bg-muted text-left font-medium">Technician</th>
                  {activeWorkTypes.map(wt => (
                    <th key={wt.id} className="border p-2 bg-muted text-center font-medium text-sm">{wt.name}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {matrixData.map(row => (
                    <tr key={row.technician.id}>
                      <td className="border p-2 font-medium">{row.technician.full_name}</td>
                      {activeWorkTypes.map(wt => {
                        const skill = row.skills[wt.id];
                        return (
                          <td key={wt.id} className="border p-2 text-center">
                            {skill ? (
                              <div className="flex flex-col items-center gap-1">
                                {getProficiencyBadge(skill.proficiency)}
                                {skill.certified && <CheckCircle className="h-4 w-4 text-emerald-600" />}
                              </div>
                            ) : <span className="text-muted-foreground">-</span>}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader><CardTitle>All Skills</CardTitle></CardHeader>
          <CardContent>
            {isLoading ? <p className="text-muted-foreground">Loading...</p> : skills.length === 0 ? <p className="text-muted-foreground">No skills assigned yet.</p> : (
              <Table>
                <TableHeader><TableRow>
                  <TableHead>Technician</TableHead><TableHead>Work Type</TableHead><TableHead>Proficiency</TableHead>
                  <TableHead>Certified</TableHead><TableHead>Cert. Date</TableHead><TableHead className="text-right">Actions</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {skills.map((s, idx) => (
                    <motion.tr key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }} className="border-b">
                      <TableCell className="font-medium">{getTechName(s.technician_id)}</TableCell>
                      <TableCell>{getWorkTypeName(s.work_type_id)}</TableCell>
                      <TableCell>{getProficiencyBadge(s.proficiency_level)}</TableCell>
                      <TableCell>{s.certified ? <CheckCircle className="h-5 w-5 text-emerald-600" /> : <span className="text-muted-foreground">-</span>}</TableCell>
                      <TableCell>{s.certification_date ? format(new Date(s.certification_date), "MMM dd, yyyy") : "-"}</TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button size="icon" variant="ghost" onClick={() => openEditDialog(s)}><Edit className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDelete(s.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editingSkill ? "Edit Skill" : "Add Skill"}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Technician *</Label>
              <Select value={formTechnicianId} onValueChange={setFormTechnicianId}>
                <SelectTrigger><SelectValue placeholder="Select technician" /></SelectTrigger>
                <SelectContent>{technicians.map(t => <SelectItem key={t.id} value={t.id}>{t.full_name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Work Type *</Label>
              <Select value={formWorkTypeId} onValueChange={setFormWorkTypeId}>
                <SelectTrigger><SelectValue placeholder="Select work type" /></SelectTrigger>
                <SelectContent>{activeWorkTypes.map(w => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Proficiency Level</Label>
              <Select value={formProficiency} onValueChange={setFormProficiency}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{proficiencyLevels.map(p => <SelectItem key={p.value} value={p.value}>{p.label} — {p.desc}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2"><Switch checked={formCertified} onCheckedChange={setFormCertified} /><Label>Certified</Label></div>
              {formCertified && <Input type="date" value={formCertDate} onChange={e => setFormCertDate(e.target.value)} className="w-40" />}
            </div>
            <div className="space-y-2"><Label>Notes</Label><Textarea value={formNotes} onChange={e => setFormNotes(e.target.value)} rows={2} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={addSkill.isPending || updateSkill.isPending}>{editingSkill ? "Save Changes" : "Add Skill"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
