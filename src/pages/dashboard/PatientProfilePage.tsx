import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Pencil, Phone, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  usePatientDetail, usePatientVisits, usePatientTreatmentPlans, usePatientInvoices, usePatientPrescriptions,
} from "@/hooks/usePatientProfile";
import { useClinicalNotes } from "@/hooks/useClinicalNotes";
import { EditPatientDialog } from "@/components/dashboard/EditPatientDialog";
import { useAuth } from "@/hooks/useAuth";

// Chart tab components
import { OverviewTab } from "@/components/patient-chart/OverviewTab";
import { ComplaintsTab } from "@/components/patient-chart/ComplaintsTab";
import { DiagnosisTab } from "@/components/patient-chart/DiagnosisTab";
import { ClinicalNotesTab } from "@/components/patient-chart/ClinicalNotesTab";
import { TreatmentTab } from "@/components/patient-chart/TreatmentTab";
import { BillingTab } from "@/components/patient-chart/BillingTab";
import { PrescriptionTab } from "@/components/patient-chart/PrescriptionTab";
import { LabWorkTab } from "@/components/patient-chart/LabWorkTab";
import { DentalChartTab } from "@/components/patient-chart/DentalChartTab";
import { FilesTab } from "@/components/patient-chart/FilesTab";

export default function PatientProfilePage() {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { user, roles } = useAuth();
  const [editOpen, setEditOpen] = useState(false);

  const canViewClinical = roles.some(r => ["admin", "dentist", "hygienist"].includes(r));
  const canEditClinical = roles.some(r => ["admin", "dentist", "hygienist"].includes(r));

  // Dentists cannot see contact PII or edit patient personal info
  const isDentistOnly = roles.includes("dentist") && !roles.includes("admin") && !roles.includes("receptionist");
  // Only admin/receptionist can edit patient personal details
  const canEditPatient = roles.some(r => ["admin", "receptionist"].includes(r));

  const { data: patient, isLoading } = usePatientDetail(patientId);
  const { data: visits = [] } = usePatientVisits(patientId);
  const { data: plans = [] } = usePatientTreatmentPlans(patientId);
  const { data: invoices = [] } = usePatientInvoices(patientId);
  const { data: prescriptions = [] } = usePatientPrescriptions(patientId);
  const { data: clinicalNotes = [] } = useClinicalNotes(patientId);

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><p className="text-muted-foreground">Loading patient chart...</p></div>;
  }

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-muted-foreground">Patient not found.</p>
        <Button variant="outline" onClick={() => navigate("/dashboard/patients")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Patients
        </Button>
      </div>
    );
  }

  const initials = `${patient.first_name[0]}${patient.last_name[0]}`.toUpperCase();
  const outstandingBalance = invoices.reduce((sum, inv: any) => sum + (Number(inv.total_amount) - Number(inv.amount_paid)), 0);

  return (
    <div className="space-y-6">
      {/* Patient Chart Header */}
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/patients")} className="mt-1">
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <Avatar className="h-12 w-12 ring-2 ring-secondary/20">
          <AvatarFallback className="bg-secondary/10 text-secondary font-semibold">{initials}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{patient.first_name} {patient.last_name}</h1>
            <Badge variant={patient.status === "active" ? "default" : "secondary"} className={patient.status === "active" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : ""}>
              {patient.status}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-0.5">
            <span>{patient.gender} · {patient.date_of_birth || "DOB N/A"}</span>
            {!isDentistOnly && (
              <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{patient.phone}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isDentistOnly && (
            <Button variant="outline" size="sm" asChild>
              <a href={`https://wa.me/${patient.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-1 h-3.5 w-3.5 text-emerald-600" /> WhatsApp
              </a>
            </Button>
          )}
          {canEditPatient && (
            <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
              <Pencil className="mr-2 h-3.5 w-3.5" /> Edit
            </Button>
          )}
        </div>
      </div>

      {/* Clinical Workflow Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="flex-wrap h-auto gap-1 bg-muted/50 p-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="complaints">Complaints</TabsTrigger>
          <TabsTrigger value="diagnosis">Diagnosis</TabsTrigger>
          <TabsTrigger value="clinical-notes">Clinical Notes</TabsTrigger>
          <TabsTrigger value="dental-chart">Dental Chart</TabsTrigger>
          <TabsTrigger value="treatment">Treatment</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="prescription">Prescription</TabsTrigger>
          <TabsTrigger value="lab-work">Lab Work</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <OverviewTab patient={patient} outstandingBalance={outstandingBalance} roles={roles} />
        </TabsContent>

        <TabsContent value="complaints" className="mt-4">
          <ComplaintsTab
            patientId={patientId!}
            clinicalNotes={clinicalNotes}
            canEdit={canEditClinical}
            userId={user?.id}
          />
        </TabsContent>

        <TabsContent value="diagnosis" className="mt-4">
          <DiagnosisTab
            patientId={patientId!}
            clinicalNotes={clinicalNotes}
            canEdit={canEditClinical}
            userId={user?.id}
          />
        </TabsContent>

        <TabsContent value="clinical-notes" className="mt-4">
          <ClinicalNotesTab
            patientId={patientId!}
            clinicalNotes={clinicalNotes}
            canEdit={canEditClinical}
            userId={user?.id}
          />
        </TabsContent>

        <TabsContent value="dental-chart" className="mt-4">
          <DentalChartTab patientId={patientId!} canEdit={canEditClinical} />
        </TabsContent>

        <TabsContent value="treatment" className="mt-4">
          <TreatmentTab plans={plans} visits={visits} patientId={patientId!} roles={roles} />
        </TabsContent>

        <TabsContent value="billing" className="mt-4">
          <BillingTab invoices={invoices} roles={roles} patientId={patientId!} />
        </TabsContent>

        <TabsContent value="prescription" className="mt-4">
          <PrescriptionTab prescriptions={prescriptions} patientId={patientId!} canEdit={canEditClinical} userId={user?.id} />
        </TabsContent>

        <TabsContent value="lab-work" className="mt-4">
          <LabWorkTab patientId={patientId!} />
        </TabsContent>

        <TabsContent value="files" className="mt-4">
          <FilesTab patientId={patientId!} canUpload={canEditClinical || canEditPatient} userId={user?.id} />
        </TabsContent>
      </Tabs>

      {canEditPatient && <EditPatientDialog patient={patient} open={editOpen} onOpenChange={setEditOpen} />}
    </div>
  );
}
