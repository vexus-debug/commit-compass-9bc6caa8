import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";

import { usePatients } from "@/hooks/usePatients";
import { useDentists } from "@/hooks/useStaff";
import { useTreatments } from "@/hooks/useTreatments";
import { useCreateLabOrder } from "@/hooks/useLabOrders";

const labWorkTypes = [
  "PFM Crown", "Zirconia Crown", "E-max Crown",
  "3-Unit Bridge", "Maryland Bridge",
  "Complete Denture (Upper)", "Complete Denture (Lower)", "Partial Denture",
  "Porcelain Veneer", "Composite Veneer",
  "Night Guard", "Retainer",
  "Surgical Guide", "Study Model",
];

const externalLabs = [
  "Lagos Dental Lab", "Precision Dental", "SmileCraft Lab", "Apex Dental Works",
];

const labOrderSchema = z.object({
  patientId: z.string().min(1, "Select a patient"),
  treatmentId: z.string().min(1, "Select related treatment"),
  labWorkType: z.string().min(1, "Select lab work type"),
  lab: z.string().min(1, "Select a lab"),
  dentistId: z.string().min(1, "Select dentist"),
  dueDate: z.date({ required_error: "Select due date" }),
  notes: z.string().trim().max(500).optional(),
});

type LabOrderForm = z.infer<typeof labOrderSchema>;

interface CreateLabOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateLabOrderDialog({ open, onOpenChange }: CreateLabOrderDialogProps) {
  const { data: patients = [] } = usePatients();
  const { data: dentists = [] } = useDentists();
  const { data: treatments = [] } = useTreatments();
  const createLabOrder = useCreateLabOrder();

  const form = useForm<LabOrderForm>({
    resolver: zodResolver(labOrderSchema),
    defaultValues: {
      patientId: "",
      treatmentId: "",
      labWorkType: "",
      lab: "",
      dentistId: "",
      notes: "",
    },
  });

  function onSubmit(data: LabOrderForm) {
    createLabOrder.mutate(
      {
        patient_id: data.patientId,
        treatment_id: data.treatmentId,
        dentist_id: data.dentistId,
        lab_work_type: data.labWorkType,
        lab_name: data.lab,
        due_date: format(data.dueDate, "yyyy-MM-dd"),
        notes: data.notes || "",
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
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Lab Order</DialogTitle>
          <DialogDescription>Submit a dental lab work order.</DialogDescription>
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

            {/* Related Treatment */}
            <FormField control={form.control} name="treatmentId" render={({ field }) => (
              <FormItem>
                <FormLabel>Related Treatment *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select treatment" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {treatments.map((t) => (
                      <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            {/* Lab Work Type & Lab */}
            <div className="grid gap-3 sm:grid-cols-2">
              <FormField control={form.control} name="labWorkType" render={({ field }) => (
                <FormItem>
                  <FormLabel>Lab Work Type *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {labWorkTypes.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="lab" render={({ field }) => (
                <FormItem>
                  <FormLabel>External Lab *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select lab" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {externalLabs.map((l) => (
                        <SelectItem key={l} value={l}>{l}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Dentist & Due Date */}
            <div className="grid gap-3 sm:grid-cols-2">
              <FormField control={form.control} name="dentistId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Dentist *</FormLabel>
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

              <FormField control={form.control} name="dueDate" render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Due Date *</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        initialFocus className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Notes */}
            <FormField control={form.control} name="notes" render={({ field }) => (
              <FormItem>
                <FormLabel>Special Instructions</FormLabel>
                <FormControl><Textarea placeholder="Shade, material preferences, special notes..." rows={3} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" className="bg-secondary hover:bg-secondary/90" disabled={createLabOrder.isPending}>
                {createLabOrder.isPending ? "Creating..." : "Create Lab Order"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
