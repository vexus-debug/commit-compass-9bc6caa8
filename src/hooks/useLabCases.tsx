import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface LabCaseRow {
  id: string;
  case_number: string;
  patient_id: string;
  dentist_id: string;
  assigned_technician_id: string | null;
  treatment_id: string | null;
  tooth_number: number | null;
  work_type: string;
  instructions: string;
  status: string;
  is_urgent: boolean;
  due_date: string | null;
  sent_date: string | null;
  completed_date: string | null;
  delivered_date: string | null;
  delivery_method: string;
  lab_fee: number;
  discount: number;
  net_amount: number;
  is_paid: boolean;
  created_at: string;
  updated_at: string;
  // New fields
  clinic_code: string;
  clinic_doctor_name: string;
  job_instructions: string[];
  job_description: string;
  shade: string;
  remark: string;
  registered_by: string | null;
  registered_by_name: string | null;
  // Joins
  patients: { first_name: string; last_name: string } | null;
  dentist: { full_name: string } | null;
  technician: { full_name: string } | null;
  treatments: { name: string } | null;
}

export function useLabCases() {
  return useQuery({
    queryKey: ["lab_cases"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lab_cases")
        .select(
          "*, patients(first_name, last_name), dentist:staff!lab_cases_dentist_id_fkey(full_name), technician:staff!lab_cases_assigned_technician_id_fkey(full_name), treatments(name)"
        )
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as LabCaseRow[];
    },
  });
}

export function useLabCaseStats() {
  const { data: cases = [], isLoading } = useLabCases();

  const stats = {
    total: cases.length,
    pending: cases.filter((c) => c.status === "pending").length,
    inProgress: cases.filter((c) => c.status === "in-progress").length,
    ready: cases.filter((c) => c.status === "ready").length,
    delivered: cases.filter((c) => c.status === "delivered").length,
    urgent: cases.filter((c) => c.is_urgent && c.status !== "delivered").length,
    overdue: cases.filter(
      (c) =>
        c.due_date &&
        new Date(c.due_date) < new Date() &&
        !["delivered", "ready"].includes(c.status)
    ).length,
    unpaid: cases.filter((c) => !c.is_paid && Number(c.lab_fee) > 0).length,
    totalFees: cases.reduce((sum, c) => sum + Number(c.lab_fee), 0),
    totalNet: cases.reduce((sum, c) => sum + Number(c.net_amount || 0), 0),
    paidFees: cases
      .filter((c) => c.is_paid)
      .reduce((sum, c) => sum + Number(c.net_amount || c.lab_fee), 0),
  };

  return { stats, cases, isLoading };
}

export function useCreateLabCase() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (labCase: {
      patient_id: string;
      dentist_id: string;
      assigned_technician_id?: string;
      treatment_id?: string;
      tooth_number?: number;
      work_type: string;
      instructions?: string;
      is_urgent?: boolean;
      due_date?: string;
      lab_fee?: number;
      // New fields
      clinic_code?: string;
      clinic_doctor_name?: string;
      job_instructions?: string[];
      job_description?: string;
      shade?: string;
      discount?: number;
      remark?: string;
      is_paid?: boolean;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      let registeredByName = "Unknown";
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("user_id", user.id)
          .maybeSingle();
        if (profile?.full_name) registeredByName = profile.full_name;
      }

      const { data, error } = await supabase
        .from("lab_cases")
        .insert({
          ...labCase,
          registered_by: user?.id,
          registered_by_name: registeredByName,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lab_cases"] });
      toast({ title: "Lab case created" });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateLabCase() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: {
      id: string;
      status?: string;
      assigned_technician_id?: string;
      is_urgent?: boolean;
      is_paid?: boolean;
      completed_date?: string;
      delivered_date?: string;
      delivery_method?: string;
      lab_fee?: number;
      discount?: number;
      instructions?: string;
      remark?: string;
      shade?: string;
      job_description?: string;
      job_instructions?: string[];
      clinic_code?: string;
      clinic_doctor_name?: string;
    }) => {
      const { data, error } = await supabase
        .from("lab_cases")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lab_cases"] });
      toast({ title: "Lab case updated" });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
