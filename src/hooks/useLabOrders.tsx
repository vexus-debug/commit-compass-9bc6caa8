import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface LabOrderRow {
  id: string;
  patient_id: string;
  treatment_id: string | null;
  dentist_id: string;
  lab_work_type: string;
  lab_name: string;
  due_date: string | null;
  sent_date: string | null;
  received_date: string | null;
  status: string;
  notes: string;
  created_at: string;
  patients: { first_name: string; last_name: string } | null;
  staff: { full_name: string } | null;
  treatments: { name: string } | null;
}

export function useLabOrders() {
  return useQuery({
    queryKey: ["lab_orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lab_orders")
        .select("*, patients(first_name, last_name), staff(full_name), treatments(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as LabOrderRow[];
    },
  });
}

export function useCreateLabOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (order: {
      patient_id: string;
      treatment_id?: string;
      dentist_id: string;
      lab_work_type: string;
      lab_name: string;
      due_date?: string;
      notes?: string;
    }) => {
      const { data, error } = await supabase.from("lab_orders").insert(order).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lab_orders"] });
      toast({ title: "Lab order created" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}
