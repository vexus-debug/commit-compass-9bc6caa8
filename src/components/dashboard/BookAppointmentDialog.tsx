import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription,
} from "@/components/ui/form";
import { usePatients } from "@/hooks/usePatients";
import { useDentists } from "@/hooks/useStaff";
import { useTreatments } from "@/hooks/useTreatments";
import { useCreateAppointment } from "@/hooks/useAppointments";

const timeSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
  "03:00 PM", "03:30 PM", "04:00 PM",
];

const chairs = ["Chair 1", "Chair 2", "Chair 3"];

const bookingSchema = z.object({
  patientId: z.string().min(1, "Select a patient"),
  dentistId: z.string().min(1, "Select a dentist"),
  chair: z.string().min(1, "Select a chair"),
  date: z.date({ required_error: "Select a date" }),
  time: z.string().min(1, "Select a time slot"),
  treatmentId: z.string().min(1, "Select treatment type"),
  isWalkIn: z.boolean(),
  notes: z.string().trim().max(500).optional(),
});

type BookingForm = z.infer<typeof bookingSchema>;

interface BookAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedPatientId?: string;
}

export function BookAppointmentDialog({ open, onOpenChange, preselectedPatientId }: BookAppointmentDialogProps) {
  const { data: patients = [] } = usePatients();
  const { data: dentists = [] } = useDentists();
  const { data: treatments = [] } = useTreatments();
  const createAppointment = useCreateAppointment();

  const form = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      patientId: preselectedPatientId || "",
      dentistId: "",
      chair: "",
      time: "",
      treatmentId: "",
      isWalkIn: false,
      notes: "",
    },
  });

  function onSubmit(data: BookingForm) {
    createAppointment.mutate(
      {
        patient_id: data.patientId,
        staff_id: data.dentistId,
        treatment_id: data.treatmentId,
        appointment_date: format(data.date, "yyyy-MM-dd"),
        appointment_time: data.time,
        chair: data.chair,
        is_walk_in: data.isWalkIn,
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
          <DialogTitle>Book Appointment</DialogTitle>
          <DialogDescription>Schedule a new patient appointment.</DialogDescription>
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
                <FormLabel>Dentist *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select dentist" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {dentists.map((d) => (
                      <SelectItem key={d.id} value={d.id}>{d.full_name} — {d.specialty}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            {/* Date & Time */}
            <div className="grid gap-3 sm:grid-cols-2">
              <FormField control={form.control} name="date" render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date *</FormLabel>
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

              <FormField control={form.control} name="time" render={({ field }) => (
                <FormItem>
                  <FormLabel>Time *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {timeSlots.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Chair & Treatment */}
            <div className="grid gap-3 sm:grid-cols-2">
              <FormField control={form.control} name="chair" render={({ field }) => (
                <FormItem>
                  <FormLabel>Chair *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select chair" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {chairs.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="treatmentId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Treatment *</FormLabel>
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
            </div>

            {/* Walk-in toggle */}
            <FormField control={form.control} name="isWalkIn" render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <FormLabel>Walk-in Patient</FormLabel>
                  <FormDescription className="text-xs">Mark if patient walked in without prior appointment</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )} />

            {/* Notes */}
            <FormField control={form.control} name="notes" render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl><Textarea placeholder="Any additional notes..." rows={2} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" className="bg-secondary hover:bg-secondary/90" disabled={createAppointment.isPending}>
                {createAppointment.isPending ? "Booking..." : "Book Appointment"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
