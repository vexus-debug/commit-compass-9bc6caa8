import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useRevenueAllocationRules() {
  return useQuery({
    queryKey: ["revenue-allocation-rules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("revenue_allocation_rules")
        .select("*")
        .order("category");
      if (error) throw error;
      return data;
    },
  });
}

export function useStaffAllocationRules() {
  return useQuery({
    queryKey: ["staff-allocation-rules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("staff_allocation_rules" as any)
        .select("*")
        .order("role_title");
      if (error) throw error;
      return data as any[];
    },
  });
}

export function useUpdateRevenueRules() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (rules: { id: string; percentage: number; effective_from?: string; effective_to?: string | null }[]) => {
      for (const rule of rules) {
        const update: any = { percentage: rule.percentage };
        if (rule.effective_from !== undefined) update.effective_from = rule.effective_from;
        if (rule.effective_to !== undefined) update.effective_to = rule.effective_to;
        const { error } = await supabase
          .from("revenue_allocation_rules")
          .update(update)
          .eq("id", rule.id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["revenue-allocation-rules"] });
      toast.success("Revenue allocation rules updated");
    },
    onError: (e: any) => toast.error(e.message),
  });
}

export function useUpdateStaffRules() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (rules: { id: string; percentage: number; effective_from?: string; effective_to?: string | null }[]) => {
      for (const rule of rules) {
        const update: any = { percentage: rule.percentage };
        if (rule.effective_from !== undefined) update.effective_from = rule.effective_from;
        if (rule.effective_to !== undefined) update.effective_to = rule.effective_to;
        const { error } = await supabase
          .from("staff_allocation_rules" as any)
          .update(update)
          .eq("id", rule.id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["staff-allocation-rules"] });
      toast.success("Staff allocation rules updated");
    },
    onError: (e: any) => toast.error(e.message),
  });
}

export function useToggleAllocationActive() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (isActive: boolean) => {
      const { error } = await supabase
        .from("revenue_allocation_rules")
        .update({ is_active: isActive })
        .neq("id", "00000000-0000-0000-0000-000000000000"); // update all
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["revenue-allocation-rules"] });
      toast.success("Allocation system toggled");
    },
    onError: (e: any) => toast.error(e.message),
  });
}

export function useRevenueSummary() {
  return useQuery({
    queryKey: ["revenue-summary"],
    queryFn: async () => {
      // Total revenue all-time
      const { data: allPayments } = await supabase
        .from("payments")
        .select("amount");

      const totalRevenue = (allPayments || []).reduce((s, p) => s + Number(p.amount), 0);

      // Revenue this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      const { data: monthPayments } = await supabase
        .from("payments")
        .select("amount")
        .gte("payment_date", startOfMonth.toISOString().split("T")[0]);

      const monthRevenue = (monthPayments || []).reduce((s, p) => s + Number(p.amount), 0);

      // War chest
      const { data: warChest } = await supabase
        .from("war_chest_entries" as any)
        .select("excess_amount");

      const warChestTotal = (warChest || []).reduce((s: number, e: any) => s + Number(e.excess_amount), 0);

      return { totalRevenue, monthRevenue, warChestTotal };
    },
  });
}

export function useAllocationBreakdown() {
  return useQuery({
    queryKey: ["allocation-breakdown"],
    queryFn: async () => {
      const { data: allAllocations } = await supabase
        .from("revenue_allocations")
        .select("category, amount");

      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      const { data: monthAllocations } = await supabase
        .from("revenue_allocations")
        .select("category, amount, created_at")
        .gte("created_at", startOfMonth.toISOString());

      // Group by category
      const allTime: Record<string, number> = {};
      const thisMonth: Record<string, number> = {};

      (allAllocations || []).forEach((a) => {
        allTime[a.category] = (allTime[a.category] || 0) + Number(a.amount);
      });
      (monthAllocations || []).forEach((a) => {
        thisMonth[a.category] = (thisMonth[a.category] || 0) + Number(a.amount);
      });

      return { allTime, thisMonth };
    },
  });
}

export function useStaffAllocationBreakdown() {
  return useQuery({
    queryKey: ["staff-allocation-breakdown"],
    queryFn: async () => {
      const { data: allAllocations } = await supabase
        .from("staff_revenue_allocations" as any)
        .select("role_title, amount");

      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      const { data: monthAllocations } = await supabase
        .from("staff_revenue_allocations" as any)
        .select("role_title, amount, created_at")
        .gte("created_at", startOfMonth.toISOString());

      const allTime: Record<string, number> = {};
      const thisMonth: Record<string, number> = {};

      ((allAllocations as any[]) || []).forEach((a) => {
        allTime[a.role_title] = (allTime[a.role_title] || 0) + Number(a.amount);
      });
      ((monthAllocations as any[]) || []).forEach((a) => {
        thisMonth[a.role_title] = (thisMonth[a.role_title] || 0) + Number(a.amount);
      });

      return { allTime, thisMonth };
    },
  });
}
