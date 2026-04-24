import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useLdSharedAllocations(caseId?: string | null) {
  return useQuery({
    queryKey: ["ld-shared-allocations", caseId],
    queryFn: async () => {
      let q = supabase
        .from("ld_shared_allocations")
        .select("*, original_tech:ld_staff!ld_shared_allocations_original_tech_id_fkey(id, full_name), helper_tech:ld_staff!ld_shared_allocations_helper_tech_id_fkey(id, full_name)")
        .order("created_at", { ascending: false });
      if (caseId) q = q.eq("case_id", caseId);
      const { data, error } = await q;
      if (error) throw error;
      return data || [];
    },
  });
}

export function useAllSharedAllocations() {
  return useQuery({
    queryKey: ["ld-shared-allocations-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ld_shared_allocations")
        .select("*, original_tech:ld_staff!ld_shared_allocations_original_tech_id_fkey(id, full_name), helper_tech:ld_staff!ld_shared_allocations_helper_tech_id_fkey(id, full_name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });
}

export function useCreateLdSharedAllocation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: {
      case_id: string;
      original_tech_id: string;
      helper_tech_id: string;
      share_percentage?: number;
      reason?: string;
      recorded_by?: string;
      recorded_by_name?: string;
    }) => {
      const { error } = await supabase.from("ld_shared_allocations").insert([values as any]);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ld-shared-allocations"] });
      qc.invalidateQueries({ queryKey: ["ld-shared-allocations-all"] });
      toast.success("Shared allocation recorded — debit & bonus applied automatically");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteLdSharedAllocation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("ld_shared_allocations").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ld-shared-allocations"] });
      qc.invalidateQueries({ queryKey: ["ld-shared-allocations-all"] });
      toast.success("Shared allocation removed");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

// Helper: count how many times each tech needed help (to flag slow workers)
export function getSharedAllocationStats(allocations: any[]) {
  const neededHelp: Record<string, { count: number; name: string }> = {};
  const gavHelp: Record<string, { count: number; name: string }> = {};

  allocations.forEach((a: any) => {
    const origId = a.original_tech_id;
    const helpId = a.helper_tech_id;
    const origName = a.original_tech?.full_name || "Unknown";
    const helpName = a.helper_tech?.full_name || "Unknown";

    if (!neededHelp[origId]) neededHelp[origId] = { count: 0, name: origName };
    neededHelp[origId].count++;

    if (!gavHelp[helpId]) gavHelp[helpId] = { count: 0, name: helpName };
    gavHelp[helpId].count++;
  });

  return { neededHelp, gavHelp };
}
