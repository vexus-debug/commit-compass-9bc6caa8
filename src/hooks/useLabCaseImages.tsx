import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export function useLabCaseImages(caseIds: string[]) {
  return useQuery({
    queryKey: ["lab_case_images", caseIds],
    enabled: caseIds.length > 0,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lab_case_images")
        .select("*")
        .in("lab_case_id", caseIds)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });
}

export function useUploadLabCaseImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ file, labCaseId, description, userId }: {
      file: File;
      labCaseId: string;
      description?: string;
      userId?: string;
    }) => {
      const ext = file.name.split(".").pop();
      const path = `${labCaseId}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("lab-case-images").upload(path, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from("lab-case-images").getPublicUrl(path);

      const { data, error } = await supabase.from("lab_case_images").insert({
        lab_case_id: labCaseId,
        image_url: publicUrl,
        description: description || "",
        uploaded_by: userId || null,
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["lab_case_images"] });
      toast({ title: "Lab image uploaded" });
    },
    onError: (e) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });
}
