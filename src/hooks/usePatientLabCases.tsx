import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function usePatientLabCases(patientId: string | undefined) {
  return useQuery({
    queryKey: ["patient-lab-cases", patientId],
    enabled: !!patientId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lab_cases")
        .select(
          "*, dentist:staff!lab_cases_dentist_id_fkey(full_name), technician:staff!lab_cases_assigned_technician_id_fkey(full_name)"
        )
        .eq("patient_id", patientId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });
}
