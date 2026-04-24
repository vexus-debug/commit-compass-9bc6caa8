import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface PrescriptionRow {
  id: string;
  patient_id: string;
  dentist_id: string;
  prescription_date: string;
  diagnosis: string;
  notes: string;
  created_at: string;
  patients: { first_name: string; last_name: string } | null;
  staff: { full_name: string } | null;
  prescription_medications: { id: string; name: string; dosage: string; frequency: string; duration: string }[];
}

export function usePrescriptions() {
  return useQuery({
    queryKey: ["prescriptions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prescriptions")
        .select("*, patients(first_name, last_name), staff(full_name), prescription_medications(*)")
        .order("prescription_date", { ascending: false });
      if (error) throw error;
      return data as PrescriptionRow[];
    },
  });
}

export function useCreatePrescription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      patient_id: string;
      dentist_id: string;
      medications: { name: string; dosage: string; frequency: string; duration: string }[];
    }) => {
      const { data: rx, error: rxErr } = await supabase
        .from("prescriptions")
        .insert({ patient_id: input.patient_id, dentist_id: input.dentist_id })
        .select()
        .single();
      if (rxErr) throw rxErr;

      const meds = input.medications.map((m) => ({ ...m, prescription_id: rx.id }));
      const { error: medErr } = await supabase.from("prescription_medications").insert(meds);
      if (medErr) throw medErr;

      return rx;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
      toast({ title: "Prescription created" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}
