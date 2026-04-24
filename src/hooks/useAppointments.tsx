import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

export interface AppointmentRow {
  id: string;
  patient_id: string;
  staff_id: string;
  treatment_id: string | null;
  appointment_date: string;
  appointment_time: string;
  chair: string;
  status: string;
  is_walk_in: boolean;
  notes: string;
  created_at: string;
  updated_at: string;
  patients: { first_name: string; last_name: string } | null;
  staff: { full_name: string } | null;
  treatments: { name: string } | null;
}

export function useAppointmentsByDate(date: Date) {
  const dateStr = format(date, "yyyy-MM-dd");
  return useQuery({
    queryKey: ["appointments", dateStr],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select("*, patients(first_name, last_name), staff(full_name), treatments(name)")
        .eq("appointment_date", dateStr)
        .order("appointment_time");
      if (error) throw error;
      return data as AppointmentRow[];
    },
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (appointment: {
      patient_id: string;
      staff_id: string;
      treatment_id?: string;
      appointment_date: string;
      appointment_time: string;
      chair: string;
      is_walk_in: boolean;
      notes?: string;
    }) => {
      const { data, error } = await supabase.from("appointments").insert(appointment).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast({ title: "Appointment booked" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; status?: string; appointment_time?: string; appointment_date?: string; chair?: string; staff_id?: string; notes?: string }) => {
      const { data, error } = await supabase.from("appointments").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast({ title: "Appointment updated" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}
