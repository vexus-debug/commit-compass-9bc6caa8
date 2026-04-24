import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Clinic Documents
export function useClinicDocuments() {
  return useQuery({
    queryKey: ["clinic_documents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clinic_documents")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useUploadClinicDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ file, title, category, expiryDate, notes, userId }: {
      file: File;
      title: string;
      category: string;
      expiryDate?: string;
      notes?: string;
      userId?: string;
    }) => {
      const path = `clinic/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from("clinic-documents").upload(path, file);
      if (uploadError) throw uploadError;

      // For private bucket, use createSignedUrl or just store path
      const file_url = path;

      const { data, error } = await supabase.from("clinic_documents").insert({
        title,
        category,
        file_url,
        expiry_date: expiryDate || null,
        notes: notes || "",
        uploaded_by: userId || null,
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clinic_documents"] });
      toast({ title: "Document uploaded" });
    },
    onError: (e) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });
}

export function useDeleteClinicDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("clinic_documents").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clinic_documents"] });
      toast({ title: "Document deleted" });
    },
    onError: (e) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });
}

// Patient Documents
export function usePatientDocuments(patientId?: string) {
  return useQuery({
    queryKey: ["patient_documents", patientId],
    enabled: !!patientId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("patient_documents")
        .select("*")
        .eq("patient_id", patientId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useUploadPatientDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ file, patientId, title, category, notes, userId }: {
      file: File;
      patientId: string;
      title: string;
      category: string;
      notes?: string;
      userId?: string;
    }) => {
      const path = `patients/${patientId}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from("clinic-documents").upload(path, file);
      if (uploadError) throw uploadError;

      const file_url = path;

      const { data, error } = await supabase.from("patient_documents").insert({
        patient_id: patientId,
        title,
        category,
        file_url,
        notes: notes || "",
        uploaded_by: userId || null,
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["patient_documents"] });
      toast({ title: "Document uploaded" });
    },
    onError: (e) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });
}
