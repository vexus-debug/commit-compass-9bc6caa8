import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useLdExpenseCategories() {
  return useQuery({
    queryKey: ["ld-expense-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ld_expense_categories" as any)
        .select("*")
        .order("name", { ascending: true });
      if (error) throw error;
      return (data || []) as unknown as { id: string; name: string; is_active: boolean; created_at: string }[];
    },
  });
}

export function useCreateLdExpenseCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      const { error } = await supabase.from("ld_expense_categories" as any).insert({ name } as any);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["ld-expense-categories"] }); toast.success("Category added"); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateLdExpenseCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...values }: { id: string; name?: string; is_active?: boolean }) => {
      const { error } = await supabase.from("ld_expense_categories" as any).update(values as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["ld-expense-categories"] }); toast.success("Category updated"); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteLdExpenseCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("ld_expense_categories" as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["ld-expense-categories"] }); toast.success("Category deleted"); },
    onError: (e: Error) => toast.error(e.message),
  });
}
