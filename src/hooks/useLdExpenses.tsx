import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useLdExpenses() {
  return useQuery({
    queryKey: ["ld-expenses"],
    queryFn: async () => {
      const { data, error } = await supabase.from("ld_expenses").select("*").order("expense_date", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });
}

export function useCreateLdExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: Record<string, unknown>) => {
      const { error } = await supabase.from("ld_expenses").insert([values as any]);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["ld-expenses"] }); toast.success("Expense added"); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateLdExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...values }: { id: string } & Record<string, unknown>) => {
      const { error } = await supabase.from("ld_expenses").update(values as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["ld-expenses"] }); toast.success("Expense updated"); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteLdExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("ld_expenses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["ld-expenses"] }); toast.success("Expense deleted"); },
    onError: (e: Error) => toast.error(e.message),
  });
}
