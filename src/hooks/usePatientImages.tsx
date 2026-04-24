import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export function usePatientImages(patientId?: string) {
  return useQuery({
    queryKey: ["patient_images", patientId],
    enabled: !!patientId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("patient_images")
        .select("*")
        .eq("patient_id", patientId!)
        .order("date_taken", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useUploadPatientImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ file, patientId, imageType, toothNumber, description, userId, clinicalNoteId }: {
      file: File;
      patientId: string;
      imageType: string;
      toothNumber?: number;
      description?: string;
      userId?: string;
      clinicalNoteId?: string;
    }) => {
      const ext = file.name.split(".").pop();
      const path = `${patientId}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("patient-images").upload(path, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from("patient-images").getPublicUrl(path);

      const { data, error } = await supabase.from("patient_images").insert({
        patient_id: patientId,
        image_url: publicUrl,
        image_type: imageType,
        tooth_number: toothNumber || null,
        description: description || "",
        uploaded_by: userId || null,
        clinical_note_id: clinicalNoteId || null,
      } as any).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["patient_images"] });
      toast({ title: "Image uploaded" });
    },
    onError: (e) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });
}

export function useDeletePatientImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("patient_images").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["patient_images"] });
      toast({ title: "Image deleted" });
    },
    onError: (e) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });
}
