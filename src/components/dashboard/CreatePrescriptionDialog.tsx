import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Trash2, Plus, Zap } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { usePatients } from "@/hooks/usePatients";
import { useDentists } from "@/hooks/useStaff";
import { useCreatePrescription } from "@/hooks/usePrescriptions";

const prescriptionTemplates = [
  {
    label: "Post-Extraction",
    medications: [
      { name: "Amoxicillin 500mg", dosage: "1 cap 3x daily", frequency: "After meals", duration: "7 days" },
      { name: "Ibuprofen 400mg", dosage: "1 tab 2x daily", frequency: "After meals", duration: "5 days" },
    ],
  },
  {
    label: "Post Root Canal",
    medications: [
      { name: "Metronidazole 400mg", dosage: "1 tab 3x daily", frequency: "After meals", duration: "5 days" },
      { name: "Paracetamol 500mg", dosage: "1-2 tabs as needed", frequency: "Every 6 hours", duration: "3 days" },
    ],
  },
  {
    label: "Periodontal Treatment",
    medications: [
      { name: "Chlorhexidine Mouthwash 0.2%", dosage: "Rinse 15ml", frequency: "2x daily", duration: "14 days" },
    ],
  },
];

const prescriptionSchema = z.object({
  patientId: z.string().min(1, "Select a patient"),
  dentistId: z.string().min(1, "Select a dentist"),
  medications: z.array(z.object({
    name: z.string().trim().min(1, "Required"),
    dosage: z.string().trim().min(1, "Required"),
    frequency: z.string().trim().min(1, "Required"),
    duration: z.string().trim().min(1, "Required"),
  })).min(1, "Add at least one medication"),
});

type PrescriptionForm = z.infer<typeof prescriptionSchema>;

interface CreatePrescriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreatePrescriptionDialog({ open, onOpenChange }: CreatePrescriptionDialogProps) {
  const { data: patients = [] } = usePatients();
  const { data: dentists = [] } = useDentists();
  const createPrescription = useCreatePrescription();

  const form = useForm<PrescriptionForm>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      patientId: "",
      dentistId: dentists[0]?.id || "",
      medications: [{ name: "", dosage: "", frequency: "", duration: "" }],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "medications",
  });

  function applyTemplate(index: number) {
    const template = prescriptionTemplates[index];
    replace(template.medications);
  }

  function onSubmit(data: PrescriptionForm) {
    createPrescription.mutate(
      {
        patient_id: data.patientId,
        dentist_id: data.dentistId,
        medications: data.medications as { name: string; dosage: string; frequency: string; duration: string }[],
      },
      {
        onSuccess: () => {
          form.reset();
          onOpenChange(false);
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Prescription</DialogTitle>
          <DialogDescription>Create a digital prescription for a patient.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Patient */}
            <FormField control={form.control} name="patientId" render={({ field }) => (
              <FormItem>
                <FormLabel>Patient *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select patient" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {patients.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.first_name} {p.last_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            {/* Dentist */}
            <FormField control={form.control} name="dentistId" render={({ field }) => (
              <FormItem>
                <FormLabel>Prescribing Dentist *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select dentist" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {dentists.map((d) => (
                      <SelectItem key={d.id} value={d.id}>{d.full_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            {/* Quick Templates */}
            <div>
              <FormLabel className="mb-1.5 block">Quick Templates</FormLabel>
              <div className="flex flex-wrap gap-2">
                {prescriptionTemplates.map((tpl, i) => (
                  <Button key={i} type="button" variant="outline" size="sm" className="text-xs" onClick={() => applyTemplate(i)}>
                    <Zap className="mr-1 h-3 w-3" /> {tpl.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Medications */}
            <div className="space-y-3">
              <FormLabel>Medications *</FormLabel>
              {fields.map((field, index) => (
                <div key={field.id} className="rounded-lg border p-3 space-y-2 relative">
                  {fields.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => remove(index)}>
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  )}
                  <FormField control={form.control} name={`medications.${index}.name`} render={({ field }) => (
                    <FormItem>
                      <FormControl><Input placeholder="Medication name" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="grid grid-cols-3 gap-2">
                    <FormField control={form.control} name={`medications.${index}.dosage`} render={({ field }) => (
                      <FormItem>
                        <FormControl><Input placeholder="Dosage" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name={`medications.${index}.frequency`} render={({ field }) => (
                      <FormItem>
                        <FormControl><Input placeholder="Frequency" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name={`medications.${index}.duration`} render={({ field }) => (
                      <FormItem>
                        <FormControl><Input placeholder="Duration" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => append({ name: "", dosage: "", frequency: "", duration: "" })}>
                <Plus className="mr-1 h-3.5 w-3.5" /> Add Medication
              </Button>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" className="bg-secondary hover:bg-secondary/90" disabled={createPrescription.isPending}>
                {createPrescription.isPending ? "Creating..." : "Create Prescription"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
