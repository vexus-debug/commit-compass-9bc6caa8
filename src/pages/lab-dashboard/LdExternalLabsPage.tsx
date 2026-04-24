import { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Building2, Send, ArrowLeftRight, Package } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useLdExternalLabs, useAddLdExternalLab, useUpdateLdExternalLab, useDeleteLdExternalLab, useLdOutsourcedCases, useAddLdOutsourcedCase, useUpdateLdOutsourcedCase } from "@/hooks/useLdExtendedFeatures";
import { useLdCases } from "@/hooks/useLabDashboard";
import { motion } from "framer-motion";

const statusColors: Record<string, string> = {
  sent: "bg-blue-100 text-blue-800",
  "in-progress": "bg-amber-100 text-amber-800",
  returned: "bg-emerald-100 text-emerald-800",
  issue: "bg-destructive/20 text-destructive",
};

export default function LdExternalLabsPage() {
  const { data: labs = [], isLoading } = useLdExternalLabs();
  const { data: outsourcedCases = [] } = useLdOutsourcedCases();
  const { data: cases = [] } = useLdCases();
  const addLab = useAddLdExternalLab();
  const updateLab = useUpdateLdExternalLab();
  const deleteLab = useDeleteLdExternalLab();
  const addOutsourced = useAddLdOutsourcedCase();
  const updateOutsourced = useUpdateLdOutsourcedCase();

  const [labDialogOpen, setLabDialogOpen] = useState(false);
  const [outsourceDialogOpen, setOutsourceDialogOpen] = useState(false);
  const [editingLab, setEditingLab] = useState<any>(null);

  // Lab form
  const [formName, setFormName] = useState("");
  const [formContactPerson, setFormContactPerson] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formAddress, setFormAddress] = useState("");
  const [formSpecialties, setFormSpecialties] = useState("");
  const [formStatus, setFormStatus] = useState("active");
  const [formNotes, setFormNotes] = useState("");

  // Outsource form
  const [outCaseId, setOutCaseId] = useState("");
  const [outLabId, setOutLabId] = useState("");
  const [outExpectedReturn, setOutExpectedReturn] = useState("");
  const [outCost, setOutCost] = useState(0);
  const [outNotes, setOutNotes] = useState("");

  const resetLabForm = () => {
    setFormName("");
    setFormContactPerson("");
    setFormPhone("");
    setFormEmail("");
    setFormAddress("");
    setFormSpecialties("");
    setFormStatus("active");
    setFormNotes("");
    setEditingLab(null);
  };

  const openCreateLabDialog = () => {
    resetLabForm();
    setLabDialogOpen(true);
  };

  const openEditLabDialog = (lab: any) => {
    setEditingLab(lab);
    setFormName(lab.name);
    setFormContactPerson(lab.contact_person || "");
    setFormPhone(lab.phone || "");
    setFormEmail(lab.email || "");
    setFormAddress(lab.address || "");
    setFormSpecialties((lab.specialties || []).join(", "));
    setFormStatus(lab.status);
    setFormNotes(lab.notes || "");
    setLabDialogOpen(true);
  };

  const handleSaveLab = async () => {
    if (!formName) {
      toast.error("Lab name is required");
      return;
    }
    const payload = {
      name: formName,
      contact_person: formContactPerson,
      phone: formPhone,
      email: formEmail,
      address: formAddress,
      specialties: formSpecialties.split(",").map(s => s.trim()).filter(Boolean),
      status: formStatus,
      notes: formNotes,
    };
    try {
      if (editingLab) {
        await updateLab.mutateAsync({ id: editingLab.id, ...payload });
        toast.success("Lab updated");
      } else {
        await addLab.mutateAsync(payload as any);
        toast.success("Lab added");
      }
      setLabDialogOpen(false);
      resetLabForm();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDeleteLab = async (id: string) => {
    if (!confirm("Delete this external lab?")) return;
    try {
      await deleteLab.mutateAsync(id);
      toast.success("Deleted");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const openOutsourceDialog = () => {
    setOutCaseId("");
    setOutLabId("");
    setOutExpectedReturn("");
    setOutCost(0);
    setOutNotes("");
    setOutsourceDialogOpen(true);
  };

  const handleOutsourceCase = async () => {
    if (!outCaseId || !outLabId) {
      toast.error("Case and external lab are required");
      return;
    }
    try {
      await addOutsourced.mutateAsync({
        case_id: outCaseId,
        external_lab_id: outLabId,
        expected_return_date: outExpectedReturn || null,
        cost: outCost,
        notes: outNotes,
        status: "sent",
      } as any);
      toast.success("Case outsourced");
      setOutsourceDialogOpen(false);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const markReturned = async (id: string) => {
    try {
      await updateOutsourced.mutateAsync({
        id,
        actual_return_date: format(new Date(), "yyyy-MM-dd"),
        status: "returned",
      });
      toast.success("Marked as returned");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const getLabName = (id: string | null) => labs.find(l => l.id === id)?.name || "Unknown";
  const getCaseNumber = (id: string | null) => cases.find(c => c.id === id)?.case_number || "Unknown";

  const pendingCases = cases.filter(c => c.status === "pending" || c.status === "in-progress");

  return (
    <div className="space-y-6">
      <PageHeader
        title="External Labs"
        description="Manage partner labs and outsourced cases"
      >
        <Button onClick={openOutsourceDialog} variant="outline" className="gap-2">
          <Send className="h-4 w-4" /> Outsource Case
        </Button>
        <Button onClick={openCreateLabDialog} className="gap-2">
          <Plus className="h-4 w-4" /> Add Lab
        </Button>
      </PageHeader>

      <Tabs defaultValue="labs">
        <TabsList>
          <TabsTrigger value="labs" className="gap-2"><Building2 className="h-4 w-4" /> Partner Labs</TabsTrigger>
          <TabsTrigger value="outsourced" className="gap-2"><ArrowLeftRight className="h-4 w-4" /> Outsourced Cases</TabsTrigger>
        </TabsList>

        <TabsContent value="labs" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>External Partner Labs</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-muted-foreground">Loading...</p>
              ) : labs.length === 0 ? (
                <p className="text-muted-foreground">No external labs added yet.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Lab Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Specialties</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {labs.map((lab, idx) => (
                      <motion.tr
                        key={lab.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        className="border-b"
                      >
                        <TableCell className="font-medium">{lab.name}</TableCell>
                        <TableCell>{lab.contact_person || "-"}</TableCell>
                        <TableCell>{lab.phone || "-"}</TableCell>
                        <TableCell>{lab.email || "-"}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {(lab.specialties || []).slice(0, 3).map((s, i) => (
                              <Badge key={i} variant="outline" className="text-xs">{s}</Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={lab.status === "active" ? "default" : "secondary"}>{lab.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-1">
                          <Button size="icon" variant="ghost" onClick={() => openEditLabDialog(lab)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => handleDeleteLab(lab.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="outsourced" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Outsourced Cases ({outsourcedCases.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {outsourcedCases.length === 0 ? (
                <p className="text-muted-foreground">No outsourced cases yet.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Case #</TableHead>
                      <TableHead>External Lab</TableHead>
                      <TableHead>Sent Date</TableHead>
                      <TableHead>Expected Return</TableHead>
                      <TableHead>Actual Return</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {outsourcedCases.map((oc, idx) => (
                      <motion.tr
                        key={oc.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        className="border-b"
                      >
                        <TableCell className="font-medium">{getCaseNumber(oc.case_id)}</TableCell>
                        <TableCell>{getLabName(oc.external_lab_id)}</TableCell>
                        <TableCell>{oc.sent_date ? format(new Date(oc.sent_date), "MMM dd, yyyy") : "-"}</TableCell>
                        <TableCell>{oc.expected_return_date ? format(new Date(oc.expected_return_date), "MMM dd, yyyy") : "-"}</TableCell>
                        <TableCell>{oc.actual_return_date ? format(new Date(oc.actual_return_date), "MMM dd, yyyy") : "-"}</TableCell>
                        <TableCell>${oc.cost.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge className={statusColors[oc.status] || "bg-muted"}>{oc.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {oc.status !== "returned" && (
                            <Button size="sm" variant="outline" onClick={() => markReturned(oc.id)}>
                              Mark Returned
                            </Button>
                          )}
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Lab Dialog */}
      <Dialog open={labDialogOpen} onOpenChange={setLabDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingLab ? "Edit External Lab" : "Add External Lab"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Lab Name *</Label>
              <Input value={formName} onChange={e => setFormName(e.target.value)} placeholder="Partner Lab Name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Contact Person</Label>
                <Input value={formContactPerson} onChange={e => setFormContactPerson(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={formPhone} onChange={e => setFormPhone(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={formEmail} onChange={e => setFormEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input value={formAddress} onChange={e => setFormAddress(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Specialties (comma-separated)</Label>
              <Input value={formSpecialties} onChange={e => setFormSpecialties(e.target.value)} placeholder="Zirconia, Implants, Dentures" />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formStatus} onValueChange={setFormStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea value={formNotes} onChange={e => setFormNotes(e.target.value)} rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLabDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveLab} disabled={addLab.isPending || updateLab.isPending}>
              {editingLab ? "Save Changes" : "Add Lab"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Outsource Case Dialog */}
      <Dialog open={outsourceDialogOpen} onOpenChange={setOutsourceDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Outsource Case to External Lab</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Select Case *</Label>
              <Select value={outCaseId} onValueChange={setOutCaseId}>
                <SelectTrigger><SelectValue placeholder="Choose case" /></SelectTrigger>
                <SelectContent>
                  {pendingCases.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.case_number} - {c.patient_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>External Lab *</Label>
              <Select value={outLabId} onValueChange={setOutLabId}>
                <SelectTrigger><SelectValue placeholder="Choose lab" /></SelectTrigger>
                <SelectContent>
                  {labs.filter(l => l.status === "active").map(l => (
                    <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Expected Return</Label>
                <Input type="date" value={outExpectedReturn} onChange={e => setOutExpectedReturn(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Cost ($)</Label>
                <Input type="number" value={outCost} onChange={e => setOutCost(Number(e.target.value))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea value={outNotes} onChange={e => setOutNotes(e.target.value)} rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOutsourceDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleOutsourceCase} disabled={addOutsourced.isPending}>
              Send to Lab
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
