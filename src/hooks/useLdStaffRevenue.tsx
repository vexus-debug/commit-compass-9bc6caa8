import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { calculateLdStaffAllocation } from "@/lib/ld-staff-allocation";

export function useLdStaffRevenueAllocations(periodStart?: string, periodEnd?: string) {
  return useQuery({
    queryKey: ["ld-staff-revenue-allocations", periodStart, periodEnd],
    queryFn: async () => {
      let q = supabase.from("ld_staff_revenue_allocations").select("*, staff:ld_staff(full_name, role, seniority_level)").order("created_at", { ascending: false });
      if (periodStart) q = q.gte("period_start", periodStart);
      if (periodEnd) q = q.lte("period_end", periodEnd);
      const { data, error } = await q;
      if (error) throw error;
      return data || [];
    },
  });
}

export function useCreateLdStaffRevenueAllocation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: Record<string, unknown>) => {
      const { error } = await supabase.from("ld_staff_revenue_allocations").insert([values as any]);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["ld-staff-revenue-allocations"] }); toast.success("Allocation saved"); },
    onError: (e: Error) => toast.error(e.message),
  });
}

// Calculate revenue allocation for a period
// Feature #4: 20% output uses CASE COUNT only (not revenue)
// Feature #5: Each case = 1 unit — no duplication
// Feature #6: Repeat/Remake deduction — original tech gets output % + 2× basic % penalty
// Feature #7: Shared Allocation — Staff A loses 50% output share to Staff B who helped
export function calculateStaffRevenueAllocation(
  cases: any[],
  staff: any[],
  salaryConfigs: any[],
  periodStart: Date,
  periodEnd: Date,
  paidOnly: boolean = false,
  sharedAllocations: any[] = []
) {
  return calculateLdStaffAllocation(cases, staff, salaryConfigs, periodStart, periodEnd, paidOnly, sharedAllocations);
}
