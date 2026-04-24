import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useLdRemainingCategories() {
  return useQuery({
    queryKey: ["ld-remaining-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ld_remaining_categories")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      if (error) throw error;
      return data || [];
    },
  });
}

export function useUpsertLdRemainingCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: { id?: string; category_name: string; percentage: number; sort_order?: number; is_active?: boolean }) => {
      const { error } = values.id
        ? await supabase.from("ld_remaining_categories").update(values).eq("id", values.id)
        : await supabase.from("ld_remaining_categories").insert([values as any]);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["ld-remaining-categories"] }); toast.success("Category saved"); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteLdRemainingCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("ld_remaining_categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["ld-remaining-categories"] }); toast.success("Category deleted"); },
    onError: (e: Error) => toast.error(e.message),
  });
}
