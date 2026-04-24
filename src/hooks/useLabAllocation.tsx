import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export function useLabAllocationRules() {
  return useQuery({
    queryKey: ["lab-allocation-rules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lab_allocation_rules")
        .select("*")
        .order("category");
      if (error) throw error;
      return data as any[];
    },
  });
}

export function useUpdateLabAllocationRules() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (rules: { id: string; percentage: number; effective_from?: string; effective_to?: string | null }[]) => {
      for (const rule of rules) {
        const update: any = { percentage: rule.percentage };
        if (rule.effective_from !== undefined) update.effective_from = rule.effective_from;
        if (rule.effective_to !== undefined) update.effective_to = rule.effective_to;
        const { error } = await supabase
          .from("lab_allocation_rules")
          .update(update)
          .eq("id", rule.id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["lab-allocation-rules"] });
      toast({ title: "Lab allocation rules updated" });
    },
    onError: (e: any) => {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    },
  });
}

export function useLabRevenueSummary() {
  return useQuery({
    queryKey: ["lab-revenue-summary"],
    queryFn: async () => {
      const { data: allInvoices } = await supabase
        .from("lab_invoices")
        .select("total_amount, amount_paid, status");

      const invoices = (allInvoices || []) as any[];
      const totalRevenue = invoices.reduce((s: number, i: any) => s + Number(i.total_amount), 0);
      const totalPaid = invoices.reduce((s: number, i: any) => s + Number(i.amount_paid), 0);
      const outstanding = totalRevenue - totalPaid;

      // This month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      const { data: monthInvoices } = await supabase
        .from("lab_invoices")
        .select("total_amount, amount_paid")
        .gte("invoice_date", startOfMonth.toISOString().split("T")[0]);

      const monthRevenue = ((monthInvoices || []) as any[]).reduce((s: number, i: any) => s + Number(i.total_amount), 0);

      return { totalRevenue, totalPaid, outstanding, monthRevenue };
    },
  });
}
