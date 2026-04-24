import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export function useClinicalNotes(patientId?: string) {
  return useQuery({
    queryKey: ["clinical_notes", patientId],
    enabled: !!patientId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clinical_notes")
        .select("*, appointments(appointment_date, appointment_time)")
        .eq("patient_id", patientId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useClinicalNotesByAppointment(appointmentId?: string) {
  return useQuery({
    queryKey: ["clinical_notes", "appointment", appointmentId],
    enabled: !!appointmentId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clinical_notes")
        .select("*")
        .eq("appointment_id", appointmentId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateClinicalNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (note: {
      patient_id: string;
      appointment_id?: string;
      subjective?: string;
      objective?: string;
      assessment?: string;
      plan?: string;
      created_by?: string;
    }) => {
      const { data, error } = await supabase.from("clinical_notes").insert(note).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clinical_notes"] });
      toast({ title: "Clinical note saved" });
    },
    onError: (e) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });
}

export function useUpdateClinicalNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; subjective?: string; objective?: string; assessment?: string; plan?: string }) => {
      const { data, error } = await supabase.from("clinical_notes").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clinical_notes"] });
      toast({ title: "Clinical note updated" });
    },
    onError: (e) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });
}
