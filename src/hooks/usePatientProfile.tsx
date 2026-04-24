import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function usePatientDetail(patientId: string | undefined) {
  return useQuery({
    queryKey: ["patient-detail", patientId],
    enabled: !!patientId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .eq("id", patientId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function usePatientVisits(patientId: string | undefined) {
  return useQuery({
    queryKey: ["patient-visits", patientId],
    enabled: !!patientId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select("*, staff(full_name), treatments(name, price)")
        .eq("patient_id", patientId!)
        .eq("status", "completed")
        .order("appointment_date", { ascending: false });
      if (error) throw error;
      return (data || []).map((a: any) => ({
        id: a.id,
        date: a.appointment_date,
        treatment: a.treatments?.name || "General Visit",
        dentist: a.staff?.full_name || "Unknown",
        notes: a.notes || "",
        cost: Number(a.treatments?.price || 0),
      }));
    },
  });
}

export function usePatientTreatmentPlans(patientId: string | undefined) {
  return useQuery({
    queryKey: ["patient-treatment-plans", patientId],
    enabled: !!patientId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("treatment_plans")
        .select("*, treatment_plan_procedures(*)")
        .eq("patient_id", patientId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });
}

export function usePatientInvoices(patientId: string | undefined) {
  return useQuery({
    queryKey: ["patient-invoices", patientId],
    enabled: !!patientId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .eq("patient_id", patientId!)
        .order("invoice_date", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });
}

export function usePatientPrescriptions(patientId: string | undefined) {
  return useQuery({
    queryKey: ["patient-prescriptions", patientId],
    enabled: !!patientId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prescriptions")
        .select("*, staff:dentist_id(full_name), prescription_medications(*)")
        .eq("patient_id", patientId!)
        .order("prescription_date", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });
}
