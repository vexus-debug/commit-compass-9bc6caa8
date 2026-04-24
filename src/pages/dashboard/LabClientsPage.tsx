import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Users, Building2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { useLabClients, useCreateLabClient, useUpdateLabClient, useDeleteLabClient, type LabClient } from "@/hooks/useLabClients";

export default function LabClientsPage() {
  const { data: clients = [], isLoading } = useLabClients();
  const createClient = useCreateLabClient();
  const updateClient = useUpdateLabClient();
  const deleteClient = useDeleteLabClient();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<LabClient | null>(null);

  // Form state
  const [clinicName, setClinicName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [clinicCode, setClinicCode] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  const resetForm = () => {
    setClinicName("");
    setDoctorName("");
    setClinicCode("");
    setPhone("");
    setEmail("");
    setAddress("");
    setNotes("");
    setEditing(null);
  };

  const openCreate = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (client: LabClient) => {
    setEditing(client);
    setClinicName(client.clinic_name);
    setDoctorName(client.doctor_name);
    setClinicCode(client.clinic_code || "");
    setPhone(client.phone || "");
    setEmail(client.email || "");
    setAddress(client.address || "");
    setNotes(client.notes || "");
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!doctorName.trim()) return;

    if (editing) {
      updateClient.mutate({
        id: editing.id,
        clinic_name: clinicName,
        doctor_name: doctorName,
        clinic_code: clinicCode,
        phone,
        email,
        address,
        notes,
      }, { onSuccess: () => { setDialogOpen(false); resetForm(); } });
    } else {
      createClient.mutate({
        clinic_name: clinicName,
        doctor_name: doctorName,
        clinic_code: clinicCode,
        phone,
        email,
        address,
        notes,
      }, { onSuccess: () => { setDialogOpen(false); resetForm(); } });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-secondary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Lab Clients" description="Manage external clinic and doctor clients for Impressions 'n' Teeth Ltd">
        <Button size="sm" className="bg-secondary hover:bg-secondary/90" onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      </PageHeader>

      <Card className="glass-card">
        <CardHeader className="border-b border-border/30">
          <CardTitle className="text-base flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Registered Clients
          </CardTitle>
          <CardDescription>Clinics and doctors who send lab work to Impressions 'n' Teeth Ltd</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {clients.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No lab clients yet"
              description="Add your first clinic or doctor client."
              actionLabel="Add Client"
              onAction={openCreate}
            />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Doctor / Clinic Name</TableHead>
                    <TableHead>Clinic Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">{client.doctor_name}</TableCell>
                      <TableCell className="text-sm">{client.clinic_name || "—"}</TableCell>
                      <TableCell className="font-mono text-xs text-secondary">{client.clinic_code || "—"}</TableCell>
                      <TableCell className="text-sm">{client.phone || "—"}</TableCell>
                      <TableCell className="text-sm">{client.email || "—"}</TableCell>
                      <TableCell>
                        <Badge variant={client.status === "active" ? "default" : "secondary"} className="text-[10px]">
                          {client.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(client)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive">
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Client</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete {client.doctor_name}? This cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteClient.mutate(client.id)} className="bg-destructive hover:bg-destructive/90">
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Client Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(o) => { if (!o) resetForm(); setDialogOpen(o); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Client" : "Add New Client"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Doctor / Clinic Name *</Label>
              <Input value={doctorName} onChange={(e) => setDoctorName(e.target.value)} placeholder="Dr. Smith / ABC Dental Clinic" />
            </div>
            <div>
              <Label>Clinic Name</Label>
              <Input value={clinicName} onChange={(e) => setClinicName(e.target.value)} placeholder="ABC Dental Clinic" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Clinic Code</Label>
                <Input value={clinicCode} onChange={(e) => setClinicCode(e.target.value)} placeholder="e.g. VC-001" />
              </div>
              <div>
                <Label>Phone</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+234..." />
              </div>
            </div>
            <div>
              <Label>Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="doctor@clinic.com" type="email" />
            </div>
            <div>
              <Label>Address</Label>
              <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Clinic address" />
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Additional notes..." rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>Cancel</Button>
            <Button onClick={handleSave} disabled={!doctorName.trim() || createClient.isPending || updateClient.isPending}>
              {(createClient.isPending || updateClient.isPending) ? "Saving..." : editing ? "Update" : "Add Client"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
