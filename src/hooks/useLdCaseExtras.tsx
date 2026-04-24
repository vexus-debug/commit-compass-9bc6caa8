import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// ─── Case Images ───
export function useLdCaseImages(caseId: string | null) {
  return useQuery({
    queryKey: ["ld-case-images", caseId],
    enabled: !!caseId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ld_case_images")
        .select("*")
        .eq("lab_case_id", caseId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });
}

export function useUploadLdCaseImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ file, labCaseId, description, userId }: {
      file: File; labCaseId: string; description?: string; userId?: string;
    }) => {
      const ext = file.name.split(".").pop();
      const path = `ld/${labCaseId}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("lab-case-images").upload(path, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from("lab-case-images").getPublicUrl(path);
      const { data, error } = await supabase.from("ld_case_images").insert({
        lab_case_id: labCaseId,
        image_url: publicUrl,
        description: description || "",
        uploaded_by: userId || null,
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["ld-case-images"] }); toast.success("Image uploaded"); },
    onError: (e: Error) => toast.error(e.message),
  });
}

// ─── Case Notes ───
export function useLdCaseNotes(caseId: string | null) {
  return useQuery({
    queryKey: ["ld-case-notes", caseId],
    enabled: !!caseId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ld_case_notes")
        .select("*")
        .eq("lab_case_id", caseId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });
}

export function useCreateLdCaseNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: { lab_case_id: string; note: string; user_id?: string; user_name?: string }) => {
      const { error } = await supabase.from("ld_case_notes").insert([values as any]);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["ld-case-notes"] }); toast.success("Note added"); },
    onError: (e: Error) => toast.error(e.message),
  });
}

// ─── Case History ───
export function useLdCaseHistory(caseId: string | null) {
  return useQuery({
    queryKey: ["ld-case-history", caseId],
    enabled: !!caseId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ld_case_history")
        .select("*")
        .eq("lab_case_id", caseId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });
}

export function useCreateLdCaseHistory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: { lab_case_id: string; field_changed: string; old_value?: string; new_value?: string; changed_by?: string; changed_by_name?: string }) => {
      const { error } = await supabase.from("ld_case_history").insert([values as any]);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["ld-case-history"] }); },
    onError: () => {},
  });
}

// ─── Quality Checks ───
export function useLdQualityChecks(caseId: string | null) {
  return useQuery({
    queryKey: ["ld-quality-checks", caseId],
    enabled: !!caseId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ld_quality_checks")
        .select("*")
        .eq("lab_case_id", caseId!)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data || [];
    },
  });
}

export function useCreateLdQualityCheck() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: { lab_case_id: string; check_item: string }) => {
      const { error } = await supabase.from("ld_quality_checks").insert([values as any]);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["ld-quality-checks"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateLdQualityCheck() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...values }: { id: string; is_passed?: boolean; checked_by?: string; checked_by_name?: string; checked_at?: string; notes?: string }) => {
      const { error } = await supabase.from("ld_quality_checks").update(values as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["ld-quality-checks"] }); toast.success("QC updated"); },
    onError: (e: Error) => toast.error(e.message),
  });
}

// ─── Credit Notes ───
export function useLdCreditNotes() {
  return useQuery({
    queryKey: ["ld-credit-notes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ld_credit_notes")
        .select("*, client:ld_clients(clinic_name), invoice:ld_invoices(invoice_number), case:ld_cases(case_number)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });
}

export function useCreateLdCreditNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: Record<string, unknown>) => {
      const { error } = await supabase.from("ld_credit_notes").insert([values as any]);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["ld-credit-notes"] }); toast.success("Credit note created"); },
    onError: (e: Error) => toast.error(e.message),
  });
}
