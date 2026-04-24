import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const toPreviousDay = (dateString: string) => {
  const date = new Date(`${dateString}T00:00:00`);
  date.setDate(date.getDate() - 1);
  return date.toISOString().split("T")[0];
};

const getMonthKey = (dateString?: string | null) => (dateString || "").slice(0, 7);

export function useLdSalaryConfigs(periodStart?: string, periodEnd?: string) {
  const activePeriodStart = periodStart || new Date().toISOString().split("T")[0];
  const activePeriodEnd = periodEnd || activePeriodStart;

  return useQuery({
    queryKey: ["ld-salary-configs", activePeriodStart, activePeriodEnd],
    queryFn: async () => {
      // Fetch all configs starting on or before the period end, ordered most-recent-first.
      // Pick the latest config per staff that overlaps the period; if none overlaps,
      // fall back to the most recent config that started before the period (so historical
      // months still get a sensible percentage instead of zero).
      const { data, error } = await supabase
        .from("ld_salary_config")
        .select("*, staff:ld_staff(id, full_name, role, status, specialty, created_at)")
        .lte("effective_from", activePeriodEnd)
        .order("effective_from", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;

      // We also need to consider configs that started AFTER the period end —
      // common when records were backdated (e.g. data entry began in March but
      // configs were created in April). For historical months without their
      // own config, fall back to the earliest available config as a baseline.
      const { data: futureData } = await supabase
        .from("ld_salary_config")
        .select("*, staff:ld_staff(id, full_name, role, status, specialty, created_at)")
        .gt("effective_from", activePeriodEnd)
        .order("effective_from", { ascending: true })
        .order("created_at", { ascending: true });

      const overlapping: Record<string, any> = {};
      const priorFallback: Record<string, any> = {};
      const futureFallback: Record<string, any> = {};

      (data || []).forEach((row: any) => {
        const overlapsPeriod = !row.effective_to || row.effective_to >= activePeriodStart;
        if (overlapsPeriod) {
          if (!overlapping[row.staff_id]) overlapping[row.staff_id] = row;
        } else {
          if (!priorFallback[row.staff_id]) priorFallback[row.staff_id] = row;
        }
      });

      (futureData || []).forEach((row: any) => {
        if (!futureFallback[row.staff_id]) futureFallback[row.staff_id] = row;
      });

      const allStaffIds = Array.from(new Set([
        ...((data || []).map((r: any) => r.staff_id)),
        ...((futureData || []).map((r: any) => r.staff_id)),
      ]));

      const merged = allStaffIds
        .map((staffId: string) => overlapping[staffId] || priorFallback[staffId] || futureFallback[staffId])
        .filter(Boolean);

      return merged.sort((a: any, b: any) =>
        (a.staff?.full_name || "").localeCompare(b.staff?.full_name || "")
      );
    },
  });
}

export function useSaveLdSalaryConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      effectiveFrom: string;
      configs: { staff_id: string; basic_percentage: number; output_percentage: number }[];
    }) => {
      const { effectiveFrom, configs } = payload;

      if (!configs.length) return;

      const staffIds = configs.map((config) => config.staff_id);
      const { data: existingRows, error: fetchError } = await supabase
        .from("ld_salary_config")
        .select("id, staff_id, effective_from, effective_to, created_at")
        .in("staff_id", staffIds)
        .order("effective_from", { ascending: true })
        .order("created_at", { ascending: true });

      if (fetchError) throw fetchError;

      for (const config of configs) {
        const rowsForStaff = ((existingRows as any[]) || []).filter((row) => row.staff_id === config.staff_id);
        const replacementRow = rowsForStaff.find((row) =>
          row.effective_from === effectiveFrom ||
          (!row.effective_to && getMonthKey(row.effective_from) === getMonthKey(effectiveFrom) && row.effective_from > effectiveFrom),
        );
        const nextRow = rowsForStaff
          .filter((row) => row.effective_from > effectiveFrom && row.id !== replacementRow?.id)
          .sort((a, b) => a.effective_from.localeCompare(b.effective_from))[0];

        if (replacementRow) {
          const { error } = await supabase
            .from("ld_salary_config")
            .update({
              basic_percentage: config.basic_percentage,
              output_percentage: config.output_percentage,
              effective_from: effectiveFrom,
              effective_to: nextRow ? toPreviousDay(nextRow.effective_from) : null,
            })
            .eq("id", replacementRow.id);

          if (error) throw error;
          continue;
        }

        const previousRow = rowsForStaff
          .filter((row) => row.effective_from < effectiveFrom)
          .sort((a, b) => b.effective_from.localeCompare(a.effective_from))[0];

        if (previousRow && (!previousRow.effective_to || previousRow.effective_to >= effectiveFrom)) {
          const { error } = await supabase
            .from("ld_salary_config")
            .update({ effective_to: toPreviousDay(effectiveFrom) })
            .eq("id", previousRow.id);

          if (error) throw error;
        }

        const { error: insertError } = await supabase
          .from("ld_salary_config")
          .insert([{ ...config, effective_from: effectiveFrom, effective_to: nextRow ? toPreviousDay(nextRow.effective_from) : null } as any]);

        if (insertError) throw insertError;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ld-salary-configs"] });
      toast.success("Salary percentages saved");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useLdSalaryDeductions(periodStart?: string, periodEnd?: string) {
  return useQuery({
    queryKey: ["ld-salary-deductions", periodStart, periodEnd],
    queryFn: async () => {
      let q = supabase
        .from("ld_salary_deductions")
        .select("*, staff:ld_staff(id, full_name)")
        .order("created_at", { ascending: false });
      if (periodStart) q = q.gte("period_start", periodStart);
      if (periodEnd) q = q.lte("period_end", periodEnd);
      const { data, error } = await q;
      if (error) throw error;
      return data || [];
    },
  });
}

export function useCreateLdSalaryDeduction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: {
      staff_id: string;
      period_start: string;
      period_end: string;
      deduction_type: string;
      amount: number;
      notes?: string;
    }) => {
      const { error } = await supabase.from("ld_salary_deductions").insert([values]);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ld-salary-deductions"] });
      toast.success("Deduction added");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteLdSalaryDeduction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("ld_salary_deductions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ld-salary-deductions"] });
      toast.success("Deduction removed");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
