import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export function useClinicChairs() {
  return useQuery({
    queryKey: ["clinic_chairs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clinic_chairs")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateClinicChair() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (chair: { name: string; room?: string; status?: string }) => {
      const { data, error } = await supabase.from("clinic_chairs").insert(chair).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clinic_chairs"] });
      toast({ title: "Chair added" });
    },
    onError: (e) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });
}

export function useUpdateClinicChair() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; name?: string; room?: string; status?: string }) => {
      const { data, error } = await supabase.from("clinic_chairs").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clinic_chairs"] });
      toast({ title: "Chair updated" });
    },
    onError: (e) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });
}

export function useDeleteClinicChair() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("clinic_chairs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clinic_chairs"] });
      toast({ title: "Chair removed" });
    },
    onError: (e) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });
}
