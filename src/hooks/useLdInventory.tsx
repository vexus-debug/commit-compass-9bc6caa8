import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface LdInventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  min_stock: number;
  supplier: string | null;
  last_restocked: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export function useLdInventory() {
  return useQuery({
    queryKey: ["ld_inventory"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ld_inventory" as any)
        .select("*")
        .order("name");
      if (error) throw error;
      return data as unknown as LdInventoryItem[];
    },
  });
}

export function useAddLdInventoryItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (item: Omit<LdInventoryItem, "id" | "created_at" | "updated_at">) => {
      const { error } = await supabase.from("ld_inventory" as any).insert(item as any);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ld_inventory"] }),
  });
}

export function useUpdateLdInventoryItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<LdInventoryItem>) => {
      const { error } = await supabase.from("ld_inventory" as any).update(updates as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ld_inventory"] }),
  });
}

export function useDeleteLdInventoryItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("ld_inventory" as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ld_inventory"] }),
  });
}
