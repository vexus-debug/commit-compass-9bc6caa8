import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUpdatePatient } from "@/hooks/usePatients";
import type { Patient } from "@/hooks/usePatients";

interface EditPatientDialogProps {
  patient: Patient | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditPatientDialog({ patient, open, onOpenChange }: EditPatientDialogProps) {
  const updatePatient = useUpdatePatient();
  const [form, setForm] = useState({
    first_name: "", last_name: "", phone: "", email: "", gender: "", date_of_birth: "",
    address: "", blood_group: "", emergency_contact_name: "", emergency_contact_phone: "",
    medical_history: "", allergies: "", referral_source: "", status: "active",
  });

  useEffect(() => {
    if (patient) {
      setForm({
        first_name: patient.first_name || "",
        last_name: patient.last_name || "",
        phone: patient.phone || "",
        email: patient.email || "",
        gender: patient.gender || "",
        date_of_birth: patient.date_of_birth || "",
        address: patient.address || "",
        blood_group: patient.blood_group || "",
        emergency_contact_name: patient.emergency_contact_name || "",
        emergency_contact_phone: patient.emergency_contact_phone || "",
        medical_history: patient.medical_history || "",
        allergies: patient.allergies || "",
        referral_source: patient.referral_source || "",
        status: patient.status || "active",
      });
    }
  }, [patient]);

  const handleSave = async () => {
    if (!patient) return;
    await updatePatient.mutateAsync({ id: patient.id, ...form });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Edit Patient</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">First Name *</Label>
              <Input value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Last Name *</Label>
              <Input value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Phone</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Email</Label>
              <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Gender</Label>
              <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Date of Birth</Label>
              <Input type="date" value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Blood Group</Label>
              <Input value={form.blood_group} onChange={(e) => setForm({ ...form, blood_group: e.target.value })} />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Address</Label>
            <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Emergency Contact</Label>
              <Input value={form.emergency_contact_name} onChange={(e) => setForm({ ...form, emergency_contact_name: e.target.value })} placeholder="Name" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Emergency Phone</Label>
              <Input value={form.emergency_contact_phone} onChange={(e) => setForm({ ...form, emergency_contact_phone: e.target.value })} placeholder="Phone" />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Medical History</Label>
            <Textarea value={form.medical_history} onChange={(e) => setForm({ ...form, medical_history: e.target.value })} rows={2} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Allergies</Label>
            <Input value={form.allergies} onChange={(e) => setForm({ ...form, allergies: e.target.value })} placeholder="Comma-separated" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Referral Source</Label>
              <Input value={form.referral_source} onChange={(e) => setForm({ ...form, referral_source: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} className="bg-secondary hover:bg-secondary/90" disabled={updatePatient.isPending}>
            {updatePatient.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
