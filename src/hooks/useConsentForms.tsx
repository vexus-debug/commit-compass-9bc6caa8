import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Templates
export function useConsentFormTemplates() {
  return useQuery({
    queryKey: ["consent_form_templates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("consent_form_templates")
        .select("*")
        .order("title");
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateConsentFormTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (template: { title: string; content: string; category: string; created_by?: string }) => {
      const { data, error } = await supabase.from("consent_form_templates").insert(template).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["consent_form_templates"] });
      toast({ title: "Template created" });
    },
    onError: (e) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });
}

export function useUpdateConsentFormTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; title?: string; content?: string; category?: string; is_active?: boolean }) => {
      const { data, error } = await supabase.from("consent_form_templates").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["consent_form_templates"] });
      toast({ title: "Template updated" });
    },
    onError: (e) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });
}

// Patient Consent Forms
export function usePatientConsentForms(patientId?: string) {
  return useQuery({
    queryKey: ["patient_consent_forms", patientId],
    enabled: !!patientId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("patient_consent_forms")
        .select("*, consent_form_templates(title, category)")
        .eq("patient_id", patientId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useAllConsentForms() {
  return useQuery({
    queryKey: ["patient_consent_forms", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("patient_consent_forms")
        .select("*, patients(first_name, last_name), consent_form_templates(title, category)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useCreatePatientConsentForm() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (form: {
      patient_id: string;
      template_id?: string;
      treatment_plan_id?: string;
      title: string;
      content: string;
      created_by?: string;
    }) => {
      const { data, error } = await supabase.from("patient_consent_forms").insert(form).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["patient_consent_forms"] });
      toast({ title: "Consent form created" });
    },
    onError: (e) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });
}

export function useSignConsentForm() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, signer_name, witnessed_by }: { id: string; signer_name: string; witnessed_by?: string }) => {
      const { data, error } = await supabase.from("patient_consent_forms").update({
        status: "signed",
        signed_at: new Date().toISOString(),
        signer_name,
        witnessed_by: witnessed_by || null,
      }).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["patient_consent_forms"] });
      toast({ title: "Consent form signed" });
    },
    onError: (e) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });
}
